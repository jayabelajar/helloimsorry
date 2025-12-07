"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { caveat } from "@/app/fonts"

const dummyMessages = [
  {
    id: "36632b7c-e18b-46bc-a2bb-e79a791f1b99",
    recipient: "emir ziqry",
    message: "for everything. i miss you and i love you.",
    sender: "amanda",
    created_at: "2025-12-07T14:52:00Z",
  },
  {
    id: "7f1d934a-3c73-41f3-8e62-72f4ddc98c42",
    recipient: "dwi",
    message: "thank you for staying even when i was difficult to love.",
    sender: "raka",
    created_at: "2025-12-07T09:12:00Z",
  },
  {
    id: "c9d2f183-4e4d-4d98-8ebd-31f7d9c9ef02",
    recipient: "ibu",
    message: "maaf belum bisa pulang sering-sering. i hope you feel my prayers.",
    sender: "nanda",
    created_at: "2025-12-06T22:05:00Z",
  },
  {
    id: "a13902ab-8949-4d15-a698-0357e6a1c1a1",
    recipient: "lan",
    message: "i should have listened more, i should have hugged you longer.",
    sender: "zee",
    created_at: "2025-12-06T18:41:00Z",
  },
  {
    id: "f4a213b5-5f4b-48cb-9e0c-18f3270700ab",
    recipient: "ari",
    message: "sorry for letting fear win. i choose us now, if you still do.",
    sender: "maya",
    created_at: "2025-12-05T12:10:00Z",
  },
] as const

const formatDate = (date: string) =>
  new Date(date)
    .toLocaleString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace("AM", "am")
    .replace("PM", "pm")

export function TypingHero() {
  const [typedText, setTypedText] = useState("")
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const message = dummyMessages[current]
    let charIndex = 0
    let typingTimer: ReturnType<typeof setTimeout> | null = null
    let holdTimer: ReturnType<typeof setTimeout> | null = null

    const typeNext = () => {
      if (charIndex <= message.message.length) {
        setTypedText(message.message.slice(0, charIndex))
        charIndex += 1
        typingTimer = setTimeout(typeNext, 45)
      } else {
        holdTimer = setTimeout(() => {
          setCurrent((prev) => (prev + 1) % dummyMessages.length)
        }, 2000)
      }
    }

    typingTimer = setTimeout(typeNext, 120)

    return () => {
      if (typingTimer) clearTimeout(typingTimer)
      if (holdTimer) clearTimeout(holdTimer)
    }
  }, [current])

  const highlight = dummyMessages[current]

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-grow flex-col items-center justify-center px-6 py-12 text-center md:py-16">
      <h1 className={`${caveat.className} mb-3 text-4xl leading-tight text-gray-900 md:text-6xl`}>
        hello, i&apos;m sorry
      </h1>

      <p className="mb-8 max-w-[480px] text-base leading-relaxed text-gray-500 md:text-lg">
        for everything that you can&apos;t say, let your apology, your gratitude, your love speak through your message
      </p>

      <div className="mb-10 flex w-full flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
        <Link
          href="/submit"
          className="flex w-full items-center justify-center gap-2 rounded-md bg-black px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-80 sm:w-auto min-w-[140px]"
        >
          Submit
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
          </svg>
        </Link>

        <Link
          href="/browse"
          className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-50 sm:w-auto min-w-[140px]"
        >
          Browse
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </Link>
      </div>

      <div className="w-full max-w-[520px] rounded-xl border border-gray-100/80 bg-white p-6 text-left shadow-[0_2px_12px_-2px_rgba(0,0,0,0.05)] md:p-8">
        <div className="leading-snug">
          <span className="text-lg font-normal tracking-wide text-gray-300 md:text-xl">hello</span>{" "}
          <span className={`${caveat.className} mx-1 break-words text-2xl font-bold text-gray-800 md:text-3xl`}>
            {highlight.recipient},
          </span>
          <div className="mt-1">
            <span className="text-lg font-normal tracking-wide text-gray-300 md:text-xl">i&apos;m sorry,</span>{" "}
            <span className={`${caveat.className} text-2xl text-gray-800 md:text-3xl leading-tight`}>
              {typedText}
              <span className="ml-1 inline-block h-5 w-1 animate-pulse bg-gray-400 align-middle" />
            </span>
          </div>
        </div>

        <div className="mt-6 flex items-end justify-between border-t border-transparent pt-3 md:mt-6">
          <span className={`${caveat.className} max-w-[55%] truncate text-xl text-gray-400 md:text-2xl`}>
            {highlight.sender}
          </span>
          <span className="text-[10px] font-medium text-gray-400 md:text-xs">{formatDate(highlight.created_at)}</span>
        </div>
      </div>
    </main>
  )
}
