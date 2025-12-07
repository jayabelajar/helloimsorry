import "./globals.css"
import { caveat, inter } from "./fonts"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${inter.variable} ${caveat.variable}`}>
      <body className={`${inter.className} bg-white text-gray-800 antialiased`}>
        {children}
      </body>
    </html>
  )
}
