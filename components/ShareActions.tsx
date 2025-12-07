"use client"

import { useState } from "react"

type ShareProps = {
  url: string // boleh "/message" atau full URL
  text: string
}

export function ShareActions({ url, text }: ShareProps) {
  const [copied, setCopied] = useState(false)

  // Helper: pastikan url selalu full (https://domain.com/...)
  const getFullUrl = () => {
    if (typeof window === "undefined") return url

    if (url.startsWith("http")) {
      return url
    }

    return window.location.origin + url
  }

  const handleCopy = async () => {
    const fullUrl = getFullUrl()
    if (!fullUrl) return

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        // ✅ modern browser
        await navigator.clipboard.writeText(fullUrl)
      } else {
        // ✅ fallback lama pakai textarea (lebih kompatibel)
        const textarea = document.createElement("textarea")
        textarea.value = fullUrl
        textarea.style.position = "fixed"
        textarea.style.left = "-9999px"
        document.body.appendChild(textarea)
        textarea.focus()
        textarea.select()
        document.execCommand("copy")
        document.body.removeChild(textarea)
      }

      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy", error)
      setCopied(false)
    }
  }

  const handleShareLink = () => {
    const fullUrl = getFullUrl()
    if (!fullUrl) return

    const encodedText = encodeURIComponent(text)
    const encodedUrl = encodeURIComponent(fullUrl)

    const shareLink = `https://wa.me/?text=${encodedText}%20${encodedUrl}`

    window.open(shareLink, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="mt-6 flex gap-3 text-sm">
      {/* COPY LINK */}
      <button
        type="button"
        onClick={handleCopy}
        className="rounded-full border border-gray-200 px-4 py-2 text-gray-600 transition hover:bg-gray-50"
      >
        {copied ? "Link copied!" : "Copy link"}
      </button>

      {/* SHARE KE WHATSAPP */}
      <button
        type="button"
        onClick={handleShareLink}
        className="rounded-full bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
      >
        Share WA
      </button>
    </div>
  )
}
