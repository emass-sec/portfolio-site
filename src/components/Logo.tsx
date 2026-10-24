import { site } from '../content/site'

/** The MasNet shield: a forest-green shield with two diagonal slashes. */
export function Shield({ width = 28, double = true }: { width?: number; double?: boolean }) {
  return (
    <svg width={width} height={(width * 36) / 32} viewBox="0 0 32 36" aria-hidden="true">
      <path d="M16 1.5 29.5 6.5V17c0 8.6-5.6 14.6-13.5 17.5C8.1 31.6 2.5 25.6 2.5 17V6.5Z" className="fill-forest" />
      <path d="M5 25 27 11.5" className="stroke-snow" strokeWidth="3.2" strokeLinecap="round" />
      {double && <path d="M10 28.5 28.5 17" className="stroke-snow" strokeWidth="2" strokeLinecap="round" opacity="0.7" />}
    </svg>
  )
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <a href="#top" className="flex items-center gap-2.5 text-ink no-underline" aria-label={`${site.name}, back to top`}>
      <Shield width={compact ? 22 : 28} double={!compact} />
      <span className={`font-display font-bold tracking-[0.06em] ${compact ? 'text-base' : 'text-[19px]'}`}>
        {site.wordmark}
      </span>
      {!compact && (
        <span className="hidden pt-0.5 font-mono text-[11px] tracking-[0.14em] text-lichen uppercase sm:inline md:hidden lg:inline">
          {site.wordmarkSub}
        </span>
      )}
    </a>
  )
}
