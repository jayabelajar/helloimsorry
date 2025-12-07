"use client"

import { useState } from "react"

type ShareProps = {
  url: string
  text: string
}

export function ShareActions({ url, text }: ShareProps) {
  const [copied, setCopied] = useState(false)

  const getFullUrl = () => {
    if (typeof window === "undefined") return url
    if (url.startsWith("http")) return url
    return window.location.origin + url
  }

  const handleCopy = async () => {
    const fullUrl = getFullUrl()
    if (!fullUrl) return

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(fullUrl)
      } else {
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

  const handleNativeShare = async () => {
    const fullUrl = getFullUrl()
    if (!fullUrl) return

    try {
      if (navigator.share) {
        await navigator.share({
          title: "HelloImSorry",
          text,
          url: fullUrl,
        })
      } else {
        await handleCopy()
      }
    } catch (error) {
      console.error("Share cancelled", error)
    }
  }

  const handleShareNetwork = (network: "twitter" | "whatsapp" | "telegram") => {
    const fullUrl = getFullUrl()
    if (!fullUrl) return

    const encodedText = encodeURIComponent(text)
    const encodedUrl = encodeURIComponent(fullUrl)

    const links: Record<typeof network, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    }

    window.open(links[network], "_blank", "noopener,noreferrer")
  }

  return (
    <div className="mt-6 flex flex-wrap gap-3 text-sm">
      <button
        type="button"
        onClick={handleCopy}
        className="rounded-full border border-gray-200 px-4 py-2 text-gray-600 transition hover:bg-gray-50"
      >
        {copied ? "Link copied!" : "Copy link"}
      </button>
      <button
        type="button"
        onClick={handleNativeShare}
        className="rounded-full border border-gray-900 bg-gray-900 px-4 py-2 text-white transition hover:bg-black"
      >
        Share
      </button>
      <button
        type="button"
        onClick={() => handleShareNetwork("twitter")}
        className="rounded-full border border-gray-200 px-4 py-2 text-gray-600 transition hover:bg-gray-50"
      >
        Share to X
      </button>
      <button
        type="button"
        onClick={() => handleShareNetwork("whatsapp")}
        className="rounded-full border border-gray-200 px-4 py-2 text-gray-600 transition hover:bg-gray-50"
      >
        WhatsApp
      </button>
      <button
        type="button"
        onClick={() => handleShareNetwork("telegram")}
        className="rounded-full border border-gray-200 px-4 py-2 text-gray-600 transition hover:bg-gray-50"
      >
        Telegram
      </button>
    </div>
  )
}
