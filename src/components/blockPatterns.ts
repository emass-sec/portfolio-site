/**
 * How bright a cell is (0 to 1) at time t, in seconds. Columns run left to right and rows top to
 * bottom; both are normalised to 0..1 so a pattern looks the same on any grid size.
 */
export type Pattern = (x: number, y: number, t: number) => number

const clamp = (v: number) => Math.min(1, Math.max(0, v))
/** A soft band that peaks where d is 0 and fades out over `width`. */
const band = (d: number, width: number) => clamp(1 - Math.abs(d) / width)

export const blockPatterns = {
  /** Rings that open out from the centre, like a radar ping. */
  ripple: (x, y, t) => {
    const d = Math.abs(x - 0.5) * 1.6 + Math.abs(y - 0.5)
    return band(d - ((t * 0.45) % 1.3), 0.16)
  },
  /** A bar that sweeps across, leaving a trail. */
  scan: (x, _y, t) => {
    const head = ((t * 0.5) % 1.5) - 0.2
    const d = head - x
    return d < 0 ? band(d, 0.05) : clamp(1 - d / 0.45)
  },
  /** Columns that rise in order of height, then drain away. */
  bars: (x, y, t) => {
    const height = 0.25 + x * 0.7
    const fill = (Math.sin(t * 1.4 - x * 2.2) + 1) / 2
    return 1 - y < height * fill ? 1 : 0.06
  },
  /** A wave that fills up from the bottom. */
  wave: (x, y, t) => {
    const crest = 0.55 + 0.28 * Math.sin(x * 5 - t * 2.2) + 0.12 * Math.sin(x * 9 + t * 1.3)
    return y > crest ? 1 : band(y - crest, 0.12)
  },
  /** Chevrons that march to the right. */
  chevron: (x, y, t) => {
    const d = (x - Math.abs(y - 0.5) * 0.9 - t * 0.35) % 0.5
    return band(((d + 0.5) % 0.5) - 0.25, 0.1)
  },
} satisfies Record<string, Pattern>

export type BlockPattern = keyof typeof blockPatterns
