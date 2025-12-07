import type { Metadata, Viewport } from "next"
import "./globals.css"
import { caveat, inter } from "./fonts"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://helloimsorry.vercel.app"
const siteName = "HelloImSorry"
const siteDescription =
  "Tulis dan baca pesan permintaan maaf atau ucapan terima kasih secara anonim di HelloImSorry."

export const metadata: Metadata = {
  title: {
    default: "HelloImSorry — Tulis & Baca Pesan Permintaan Maaf",
    template: "%s · HelloImSorry",
  },
  description: siteDescription,
  keywords: [
    "permintaan maaf",
    "pesan anonim",
    "helloimsorry",
    "apology wall",
    "surat cinta",
    "kirim pesan",
  ],
  authors: [{ name: "HelloImSorry" }],
  creator: "HelloImSorry",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "HelloImSorry — Dinding Pesan Permintaan Maaf",
    description: siteDescription,
    siteName,
    images: [
      {
        url: `${siteUrl}/og-cover.png`,
        width: 1200,
        height: 630,
        alt: "HelloImSorry Message Wall",
      },
    ],
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "HelloImSorry — Kirim Pesan Permintaan Maaf",
    description: siteDescription,
    creator: "@helloimsorry",
    site: "@helloimsorry",
    images: [`${siteUrl}/og-cover.png`],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#0f172a",
  colorScheme: "light",
}

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteName,
  url: siteUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/browse?query={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${inter.variable} ${caveat.variable}`}>
      <body className={`${inter.className} bg-white text-gray-800 antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  )
}
