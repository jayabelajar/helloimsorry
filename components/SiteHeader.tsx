"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { caveat } from "@/app/fonts"

const links = [
  { href: "/submit", label: "Submit" },
  { href: "/browse", label: "Browse" },
  { href: "/support", label: "Support" },
]

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="w-full border-b border-black/10 bg-white sticky top-0 z-10">
      <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className={`${caveat.className} select-none text-2xl font-bold text-gray-900`}>
          HelloImSorry =)
        </Link>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-gray-500 sm:gap-x-5 sm:text-base">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href === "/submit" && pathname?.startsWith("/submit"))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm sm:text-base text-gray-600 transition hover:text-gray-800 ${isActive ? "text-black" : ""}`}
              >
                {link.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </header>
  )
}
