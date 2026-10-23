import { useState } from 'react'
import { navLinks, site } from '../content/site'
import { useActiveSection } from '../hooks/useActiveSection'

const ids = navLinks.map((link) => link.id)

export function Nav() {
  const active = useActiveSection(ids)
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-ink-950/70 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6" aria-label="Primary">
        <a href="#top" className="font-display text-lg font-semibold tracking-tight text-white">
          {site.name}
        </a>

        <button
          type="button"
          className="rounded-md p-2 text-slate-300 md:hidden"
          aria-expanded={open}
          aria-controls="nav-links"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Toggle navigation</span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>

        <ul
          id="nav-links"
          className={`${open ? 'flex' : 'hidden'} absolute inset-x-0 top-16 flex-col gap-1 border-b border-white/5 bg-ink-950/95 px-6 py-4 md:static md:flex md:flex-row md:gap-8 md:border-0 md:bg-transparent md:p-0`}
        >
          {navLinks.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={() => setOpen(false)}
                aria-current={active === link.id ? 'true' : undefined}
                className={`block py-2 text-sm transition-colors md:py-0 ${
                  active === link.id ? 'text-accent-400' : 'text-slate-300 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
