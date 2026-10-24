import { useState } from 'react'
import { navLinks, site } from '../content/site'
import { useActiveSection } from '../hooks/useActiveSection'
import { Logo } from './Logo'

const ids = navLinks.map((link) => link.id)

export function Nav() {
  const active = useActiveSection(ids)
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-snow/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-[1200px] items-center justify-between gap-6 px-6 py-3.5" aria-label="Primary">
        <Logo />

        <button
          type="button"
          className="rounded-md p-2 text-ink md:hidden"
          aria-expanded={open}
          aria-controls="nav-links"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Toggle navigation</span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>

        <ul
          id="nav-links"
          className={`${open ? 'flex' : 'hidden'} absolute inset-x-0 top-full flex-col gap-1 border-b border-line bg-snow px-6 py-4 text-[15px] font-medium md:static md:flex md:flex-row md:items-center md:gap-5 md:border-0 lg:gap-7 md:bg-transparent md:p-0`}
        >
          {navLinks.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={() => setOpen(false)}
                aria-current={active === link.id ? 'true' : undefined}
                className={`block py-2.5 whitespace-nowrap no-underline transition-colors ${
                  active === link.id ? 'text-forest' : 'text-ink hover:text-forest'
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="pt-2 md:pt-0">
            <a
              href={site.navCta.href}
              onClick={() => setOpen(false)}
              className="btn-gloss inline-block rounded-full px-5 whitespace-nowrap py-[11px] font-semibold text-white no-underline"
            >
              {site.navCta.label}
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
}
