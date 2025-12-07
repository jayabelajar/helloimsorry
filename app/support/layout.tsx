import type { Metadata } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://helloimsorry.vercel.app"

export const metadata: Metadata = {
  title: "Support HelloImSorry — Treat Me a Coffee",
  description: "Dukung keberlangsungan HelloImSorry melalui Trakteer, Saweria, atau metode lainnya.",
  alternates: {
    canonical: `${siteUrl}/support`,
  },
}

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return children
}
