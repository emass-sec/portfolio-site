import { navLinks, site } from '../content/site'
import { Logo } from './Logo'

const year = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="border-t border-line px-6 py-8">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-x-8 gap-y-4">
        <Logo compact />
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
          {navLinks.map((link) => (
            <a key={link.id} href={`#${link.id}`} className="py-2 text-lichen no-underline hover:text-forest">
              {link.label}
            </a>
          ))}
        </nav>
        <p className="text-sm text-lichen">
          © {year} {site.name} · {site.footerNote}
        </p>
      </div>
    </footer>
  )
}
