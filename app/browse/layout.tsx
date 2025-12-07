import type { Metadata } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://helloimsorry.vercel.app"

export const metadata: Metadata = {
  title: "Browse Messages — HelloImSorry",
  description: "Cari pesan permintaan maaf anonim terbaru atau temukan pesan untukmu di halaman Browse HelloImSorry.",
  alternates: {
    canonical: `${siteUrl}/browse`,
  },
}

export default function BrowseLayout({ children }: { children: React.ReactNode }) {
  return children
}
