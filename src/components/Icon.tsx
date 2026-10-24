import type { ReactNode } from 'react'

// Line icons from the design, drawn on a 24px grid.
const paths = {
  chat: (
    <>
      <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.9A8 8 0 1 1 21 12Z" />
      <path d="M9 10.5h6" />
      <path d="M9 13.5h4" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2v3.5" />
      <path d="M12 18.5V22" />
      <path d="M2 12h3.5" />
      <path d="M18.5 12H22" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5" />
      <path d="M8 10.5c0-1.4 1.1-2.5 2.5-2.5" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  tooth: (
    <path d="M7 3c-2.5 0-4 2-4 4.5 0 4 2 6 2.5 9.5.4 2.6 1 4 2 4s1.5-2 2-4.5c.3-1.5 1-2 2.5-2s2.2.5 2.5 2c.5 2.5 1 4.5 2 4.5s1.6-1.4 2-4C19 13.5 21 11.5 21 7.5 21 5 19.5 3 17 3c-2 0-3 1-5 1S9 3 7 3Z" />
  ),
  scales: (
    <>
      <path d="M12 3v18" />
      <path d="M8 21h8" />
      <path d="M4 7h16" />
      <path d="m4 7-2.5 6a3 3 0 0 0 5 0Z" />
      <path d="m20 7-2.5 6a3 3 0 0 0 5 0Z" />
    </>
  ),
  home: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9v12h14V9" />
      <rect x="9" y="13" width="6" height="4" rx="0.5" />
      <path d="M10.5 19.5h3" />
    </>
  ),
  store: (
    <>
      <path d="M3 9 4.5 4h15L21 9" />
      <path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
      <path d="M5 12v9h14v-9" />
      <path d="M10 21v-5h4v5" />
    </>
  ),
  morph: (
    <>
      <path d="M19.5 10A8 8 0 0 0 5.6 7.2L4 9" />
      <path d="M4 4.5V9h4.5" />
      <path d="M4.5 14a8 8 0 0 0 13.9 2.8L20 15" />
      <path d="M20 19.5V15h-4.5" />
    </>
  ),
  mountain: (
    <>
      <path d="m3 20 6.5-11 4 6 2.5-4L21 20Z" />
      <path d="m8 11.5 1.5 1 1.5-1" />
    </>
  ),
  shieldCheck: (
    <>
      <path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
} satisfies Record<string, ReactNode>

export type IconName = keyof typeof paths

interface IconProps {
  name: IconName
  size?: number
  strokeWidth?: number
  className?: string
}

export function Icon({ name, size = 24, strokeWidth = 1.7, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {paths[name]}
    </svg>
  )
}
