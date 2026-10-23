import { site } from '../content/site'

const year = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 text-sm text-slate-500 md:flex-row md:justify-between">
        <p>
          © {year} {site.name}
        </p>
        <p>{site.footerNote}</p>
      </div>
    </footer>
  )
}
