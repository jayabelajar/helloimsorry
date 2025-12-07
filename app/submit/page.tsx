"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"
import { RATE_LIMIT_WINDOW_MS } from "@/lib/security/constants"
import { validateSubmissionFields } from "@/lib/security/validation"
import { caveat } from "../fonts"

export default function SubmitPage() {
  const [recipient, setRecipient] = useState("")
  const [message, setMessage] = useState("")
  const [sender, setSender] = useState("")
  const [honeypot, setHoneypot] = useState("")
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  })

  const logClientSecurityEvent = async (event: string, metadata?: Record<string, unknown>) => {
    if (typeof window === "undefined" || !window.crypto?.subtle) return
    const source = `${navigator.userAgent}-${navigator.language}-${Date.now()}`
    const encoder = new TextEncoder()
    const digest = await window.crypto.subtle.digest("SHA-256", encoder.encode(source))
    const fingerprint = Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("")
    console.warn(`[SECURITY:${event}]`, { fingerprint, ...(metadata ?? {}) })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus("idle")
    setErrorMessage(null)

    if (honeypot) {
      setLoading(false)
      setStatus("error")
      setErrorMessage("Submission rejected.")
      void logClientSecurityEvent("honeypot_triggered")
      return
    }

    if (typeof window !== "undefined") {
      const lastSubmit = window.localStorage.getItem("helloimsorry:lastSubmit")
      if (lastSubmit && Date.now() - Number(lastSubmit) < RATE_LIMIT_WINDOW_MS) {
        setLoading(false)
        setStatus("error")
        setErrorMessage("Tunggu sebentar sebelum mengirim lagi.")
        void logClientSecurityEvent("rate_limit_violation", {
          cooldownMs: RATE_LIMIT_WINDOW_MS,
        })
        return
      }
    }

    const validation = validateSubmissionFields({
      recipient,
      sender,
      message,
    })

    if (!validation.valid || !validation.sanitized) {
      setLoading(false)
      setStatus("error")
      setErrorMessage(validation.errors[0] ?? "Input tidak valid.")
      void logClientSecurityEvent("validation_failed", { reasons: validation.errors })
      return
    }

    const payload = {
      recipient: validation.sanitized.recipient,
      sender: validation.sanitized.sender,
      message: validation.sanitized.message,
      honeypot,
    }

    const response = await fetch("/api/messages/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const body = await response.json().catch(() => null)
      setStatus("error")
      setErrorMessage(body?.error || "Gagal mengirim pesan. Coba lagi.")
      void logClientSecurityEvent("submission_rejected", { status: response.status })
    } else {
      const body = await response.json().catch(() => null)
      setStatus("success")
      setRecipient("")
      setMessage("")
      setSender("")
      setHoneypot("")
      if (typeof window !== "undefined") {
        window.localStorage.setItem("helloimsorry:lastSubmit", Date.now().toString())
      }
      const newId = body?.data?.id
      if (newId) {
        router.push(`/message/${newId}`)
        return
      }
    }

    setLoading(false)
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#1a1a1a] font-sans">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-2xl flex-grow flex-col items-center px-6 pb-20 pt-12">
        <div className="mb-10 w-full rounded-2xl border border-gray-200 bg-white p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
          <div className="text-2xl leading-relaxed">
            <span className="text-xl font-normal text-gray-400">hello</span>{" "}
            <span className={`${caveat.className} mx-1 break-words text-3xl font-bold text-gray-800`}>
              {recipient || "your recipient"},
            </span>
            <br />
            <span className="text-xl font-normal text-gray-400">i&apos;m sorry,</span>{" "}
            <span className={`${caveat.className} break-words text-3xl text-gray-800`}>
              {message || "your message"}
            </span>
          </div>

          <div className="mt-12 flex items-end justify-between pt-4">
            <span className={`${caveat.className} max-w-[50%] truncate text-xl text-gray-500`}>
              {sender || "your name"}
            </span>
            <span className="text-xs text-gray-400">{today}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-6">
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="hidden"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Recipient's name"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-4 text-gray-700 placeholder-gray-500 transition focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
            required
          />

          <textarea
            placeholder="Your apology message, max 300 characters"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={300}
            rows={4}
            className="w-full resize-none rounded-lg border border-gray-300 p-4 text-gray-700 placeholder-gray-500 transition focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
            required
          />

          <input
            type="text"
            placeholder="Your name"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-4 text-gray-700 placeholder-gray-500 transition focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />

          <div className="flex w-fit items-center gap-3 rounded border border-gray-200 bg-gray-50 p-3 pr-12">
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 bg-white">
              <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="text-sm font-medium text-gray-600">Success!</div>
            <div className="ml-6 flex flex-col">
              <div className="flex items-center gap-1">
                <svg className="h-4 w-4 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
                <span className="text-[10px] font-bold text-gray-500">CLOUDFLARE</span>
              </div>
              <div className="flex gap-1 text-[8px] text-gray-400">
                <span>Privacy</span> • <span>Terms</span>
              </div>
            </div>
          </div>

          {status === "error" && errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
          {status === "success" && <p className="text-sm text-green-600">Pesan telah dikirim.</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-lg bg-gray-900 py-4 font-medium text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </main>

      <SiteFooter />
    </div>
  )
}
