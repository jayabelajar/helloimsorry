import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"
import { ShareActions } from "@/components/ShareActions"
import { caveat } from "@/app/fonts"

// --- TIPE DATA ---
type MessageRow = {
  id: string
  name: string | null
  message: string
  created_at: string
}

// --- SETUP SUPABASE FETCHING ---
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const NEXT_SITE = process.env.NEXT_PUBLIC_SITE_URL
const VERCEL_URL = process.env.VERCEL_URL
const SITE_BASE = NEXT_SITE
  ? NEXT_SITE.replace(/\/$/, "")
  : VERCEL_URL
    ? `https://${VERCEL_URL}`
    : "http://localhost:3000"

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Supabase environment variables are not configured")
}

const normalizeBaseUrl = (url: string) => url.replace(/\/$/, "")

const isValidUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)

const fetchMessage = async (id: string): Promise<MessageRow | null> => {
  if (!isValidUuid(id)) return null

  const response = await fetch(
    `${normalizeBaseUrl(SUPABASE_URL!)}/rest/v1/messages?id=eq.${encodeURIComponent(
      id,
    )}&select=id,name,message,created_at`,
    {
      headers: {
        apikey: SUPABASE_KEY!,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      cache: "no-store",
    },
  )

  if (!response.ok) return null
  const rows = (await response.json()) as MessageRow[]
  return rows?.[0] ?? null
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString("en-US", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).replace("AM", "am").replace("PM", "pm") 
}

const decodeName = (name: string | null) => {
  if (!name) return { recipient: "someone", sender: "anonymous" }
  const parts = name.split("::")
  return { 
    recipient: parts[0]?.trim() || "someone", 
    sender: parts[1]?.trim() || "anonymous" 
  }
}

// --- HALAMAN UTAMA ---
export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const rawId = params?.id ?? ""
  const decodedId = safeDecode(rawId)
  const message = await fetchMessage(decodedId)
  if (!message) {
    return {
      title: "Message not found — HelloImSorry",
      description: "Pesan yang kamu cari sudah dihapus atau disembunyikan.",
      alternates: { canonical: `${SITE_BASE}/message/${rawId}` },
    }
  }

  const decoded = decodeName(message.name)
  const summary = message.message.length > 150 ? `${message.message.slice(0, 147)}...` : message.message
  const canonical = `${SITE_BASE}/message/${message.id}`

  return {
    title: `Untuk ${decoded.recipient} — Pesan Permintaan Maaf di HelloImSorry`,
    description: summary,
    alternates: { canonical },
    openGraph: {
      title: `Pesan untuk ${decoded.recipient}`,
      description: summary,
      url: canonical,
    },
    twitter: {
      card: "summary",
      title: `Pesan untuk ${decoded.recipient}`,
      description: summary,
    },
  }
}

const safeDecode = (value: string) => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export default async function MessageDetail({
  params,
}: {
  params: { id: string }
}) {
  const rawId = params?.id ?? ""
  const decodedId = safeDecode(rawId)
  const message = await fetchMessage(decodedId)
  const decoded = decodeName(message?.name ?? null)
  const shareUrl =
    message && message.id
      ? SITE_BASE
        ? `${SITE_BASE}/message/${message.id}`
        : `/message/${message.id}`
      : ""

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#1a1a1a] font-sans">
      <SiteHeader />

      <main className="flex-grow flex flex-col items-center justify-center px-4 py-16 w-full">
        
        {!message ? (
          /* --- ERROR STATE --- */
          <div className="w-full max-w-[600px] text-center space-y-4">
             <div className="rounded-2xl border border-gray-100 bg-white p-10 shadow-sm">
                <h1 className="text-2xl font-semibold text-gray-800">Message not found</h1>
                <p className="mt-2 text-gray-500">
                  The message you&apos;re looking for doesn&apos;t exist.
                </p>
             </div>
             <Link href="/browse" className="inline-block text-sm font-medium text-gray-600 hover:text-black hover:underline">
                &larr; Back to browse
             </Link>
          </div>
        ) : (
          /* --- SUCCESS STATE --- */
          <div className="flex flex-col items-center w-full">
            <div className="w-full max-w-[640px] bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.06)] p-8 md:p-10 mb-6 transition-all">
              
              <div className="leading-snug mb-8">
                {/* Baris 1: Hello + Recipient */}
                <span className="text-gray-300 font-sans text-xl md:text-2xl font-normal tracking-wide">hello</span>{" "}
                <span className={`${caveat.className} font-bold text-gray-800 text-3xl md:text-4xl mx-2 break-words`}>
                  {decoded.recipient}
                </span>
                
                {/* Baris 2: I'm sorry + Message */}
                <div className="mt-2">
                  <span className="text-gray-300 font-sans text-xl md:text-2xl font-normal tracking-wide">i&apos;m sorry,</span>{" "}
                  <span className={`${caveat.className} text-gray-800 text-3xl md:text-4xl leading-tight break-words`}>
                    {message.message}
                  </span>
                </div>
              </div>

              {/* Card Footer: Sender & Date */}
              <div className="flex justify-between items-end mt-12 pt-4">
                <span className={`${caveat.className} text-xl md:text-2xl text-gray-400 truncate max-w-[60%]`}>
                  {decoded.sender}
                </span>
                <span className="text-[10px] md:text-xs text-gray-400 font-sans font-medium">
                  {formatDate(message.created_at)}
                </span>
              </div>
            </div>

            <ShareActions
              url={shareUrl}
              text={`hello ${decoded.recipient}, i'm sorry, ${message.message}`}
            />

            {/* CTA SECTION */}
            <div className="mt-8 flex flex-col items-center gap-5">
                <h2 className={`${caveat.className} text-3xl md:text-4xl text-gray-700 text-center`}>
                    Want to send an apology?
                </h2>
                
                {/* Tombol Hitam, Teks Putih */}
                <Link 
                    href="/submit"
                    className="bg-[#1a1a1a] hover:bg-black !text-white px-8 py-3 rounded-md transition-all shadow-md hover:shadow-lg text-sm font-medium"
                >
                    Write apology now
                </Link>
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
