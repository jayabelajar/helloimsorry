"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"
import { getVisibleMessages, type NormalizedMessage } from "@/lib/messages"
import { caveat } from "../fonts"

type Message = NormalizedMessage

const getRecipient = (message: Message) => message.recipient_name || message.name || "someone"
const getSender = (message: Message) => message.sender_name || "anonymous"

export default function BrowsePage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getVisibleMessages()
        setMessages(data as Message[])
      } catch (err) {
        console.error(err)
        setMessages([])
        setError("Tidak bisa memuat pesan saat ini.")
      } finally {
        setLoading(false)
      }
    }

    void fetchMessages()
  }, [])

  const filteredMessages = useMemo(() => {
    const query = search.trim().toLowerCase().replace(/[\s\W_]+/g, "")
    if (!query) return messages

    const normalize = (value: string | null | undefined) =>
      (value ?? "").toLowerCase().replace(/[\s\W_]+/g, "")

    return messages.filter((msg) => {
      const haystacks = [
        normalize(getRecipient(msg)),
        normalize(getSender(msg)),
        normalize(msg.message),
      ]
      return haystacks.some((value) => value.includes(query))
    })
  }, [messages, search])

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#1a1a1a] font-sans">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-5xl flex-grow flex-col items-center px-6 pb-16 pt-10">
        <div className="mb-8 flex w-full items-start gap-4 rounded-lg bg-blue-600 p-6 text-white shadow-sm">
          <div className="mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
          </div>
          <div>
            <h3 className="mb-1 text-lg font-semibold">Find Message</h3>
            <p className="text-sm text-blue-100">
              Scroll the latest messages or start typing a recipient name to find the message you&apos;re looking for.
            </p>
          </div>
        </div>

        <div className="mb-12 flex w-full flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Enter recipient name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full flex-grow rounded-lg border border-gray-300 px-4 py-3 text-[15px] text-gray-800 placeholder-gray-500 transition focus:border-gray-500 focus:outline-none focus:ring-0"
          />
          <button
            type="button"
            className="w-full rounded-lg bg-gray-900 px-8 py-3 text-sm font-medium text-white transition hover:bg-black sm:w-auto"
            onClick={() => setSearch((prev) => prev.trim())}
          >
            Search
          </button>
        </div>

        {loading ? (
          <div className="w-full py-20 text-center text-gray-400">Loading messages...</div>
        ) : error ? (
          <div className="w-full rounded-lg border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">{error}</div>
        ) : (
          <div className="grid w-full grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
            {filteredMessages.length > 0 ? (
              filteredMessages.map((msg) => (
                <Link
                  key={msg.id}
                  href={`/message/${msg.id}`}
                  className="group flex min-h-[280px] flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-md"
                >
                  <div className="leading-snug space-y-2">
                    <span className="text-xl font-normal text-gray-400">hello</span>{" "}
                    <span className={`${caveat.className} mx-1 text-3xl font-bold text-gray-800`}>
                      {getRecipient(msg)}
                    </span>
                    <div className="mt-2 line-clamp-3 break-words text-balance">
                      <span className="text-xl font-normal text-gray-400">i&apos;m sorry,</span>{" "}
                      <span className={`${caveat.className} text-3xl text-gray-800`}>{msg.message}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between pt-2">
                    <span className={`${caveat.className} max-w-[50%] truncate text-xl text-gray-500`}>
                      {getSender(msg)}
                    </span>
                    <span className="text-[11px] font-medium text-gray-400">
                      {formatDate(msg.created_at)}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-gray-400">
                No messages found{search ? ` for "${search}"` : ""}.
              </div>
            )}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}

const formatDate = (date: string) =>
  new Date(date).toLocaleString("en-US", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
