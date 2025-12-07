"use client"

import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"
import { caveat } from "../fonts"

const supportOptions = [
  {
    title: "Trakteer",
    description: "Support via Trakteer.id\n(Gopay, OVO, Dana)",
    color: "#be1e2d",
    href: "https://trakteer.id/",
    cta: "Donate Cendol →",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#be1e2d" className="h-8 w-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
  {
    title: "Saweria",
    description: "Live alert support\n(QRIS, All E-Wallet)",
    color: "#f48120",
    href: "https://saweria.co/",
    cta: "Send Support →",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#f48120" className="h-8 w-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    title: "Others",
    description: "PayPal / Buy Me a Coffee\n(International)",
    color: "#111111",
    href: "#",
    cta: "View Options →",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-8 w-8 text-gray-700">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

export default function SupportPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#1a1a1a] font-sans">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-4xl flex-grow flex-col items-center px-6 pb-20 pt-12 text-center">
        <div className="mb-16 space-y-4">
          <h1 className={`${caveat.className} text-6xl text-gray-800`}>support this project</h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-500">
            Keeping this site alive takes time and server costs. If you like what I do, you can{" "}
            <span className={`${caveat.className} text-2xl font-bold text-gray-800`}>treat me a coffee.</span>
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
          {supportOptions.map((option) => (
            <a
              key={option.title}
              href={option.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div
                className="flex h-full flex-col items-center rounded-2xl border border-gray-200 bg-white p-8 text-center transition-all duration-300 hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]"
                style={{ borderColor: `${option.color}26` }}
              >
                <div
                  className="mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${option.color}1a` }}
                >
                  {option.icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-800">{option.title}</h3>
                <p className="whitespace-pre-line text-sm leading-snug text-gray-400">{option.description}</p>
                <span
                  className="mt-6 text-sm font-semibold opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ color: option.color }}
                >
                  {option.cta}
                </span>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-20 opacity-60">
          <p className={`${caveat.className} text-2xl text-gray-500`}>&quot;thank you for being here.&quot;</p>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
