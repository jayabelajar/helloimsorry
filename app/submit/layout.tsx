import type { Metadata } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://helloimsorry.vercel.app"

export const metadata: Metadata = {
  title: "Submit Message — Kirim Permintaan Maaf | HelloImSorry",
  description:
    "Tulis pesan permintaan maaf atau ucapan terima kasih secara anonim di HelloImSorry. Aman, tervalidasi, dan langsung tampil.",
  alternates: {
    canonical: `${siteUrl}/submit`,
  },
}

export default function SubmitLayout({ children }: { children: React.ReactNode }) {
  return children
}
