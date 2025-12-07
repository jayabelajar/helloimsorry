import type { Metadata } from "next"
import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"
import { TypingHero } from "@/components/home/TypingHero"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://helloimsorry.vercel.app"

export const metadata: Metadata = {
  title: "HelloImSorry — Kirim & Baca Pesan Permintaan Maaf Anonim",
  description:
    "HelloImSorry adalah dinding pesan anonim untuk menyampaikan permintaan maaf, ucapan terima kasih, dan cinta dengan aman dan penuh cinta.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "HelloImSorry — Dinding Pesan Permintaan Maaf Anonim",
    description:
      "Kirim atau baca pesan permintaan maaf dari seluruh Indonesia. Tetap anonim dan temukan keberanian untuk meminta maaf.",
    url: siteUrl,
  },
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#1a1a1a] font-sans">
      <SiteHeader />
      <TypingHero />
      <SiteFooter />
    </div>
  )
}
