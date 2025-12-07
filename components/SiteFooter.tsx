import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="mt-auto w-full border-t border-black/10 bg-white py-6 md:py-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-y-3 px-4 text-center">
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 md:gap-6">
          <Link href="#" className="transition-colors hover:text-black">
            TikTok
          </Link>
          <Link href="#" className="transition-colors hover:text-black">
            Feedback
          </Link>
          <Link href="#" className="transition-colors hover:text-black">
            Support
          </Link>
        </div>
        <p className="text-xs font-light tracking-wide text-gray-400 md:text-sm">
          © 2025 HelloImSorry - Powered by Jayadev. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
