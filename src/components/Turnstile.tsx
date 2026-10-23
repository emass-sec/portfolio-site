import { useEffect, useLayoutEffect, useRef } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: Record<string, unknown>) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
  }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
let scriptPromise: Promise<void> | null = null

function loadScript(): Promise<void> {
  scriptPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Turnstile failed to load'))
    document.head.appendChild(script)
  })
  return scriptPromise
}

interface TurnstileProps {
  siteKey: string
  /** Bump this to get a fresh token after a submit. */
  resetKey: number
  onToken: (token: string | null) => void
}

/**
 * Renders a Cloudflare Turnstile widget. The widget also writes a hidden
 * `cf-turnstile-response` input into the surrounding form.
 */
export function Turnstile({ siteKey, resetKey, onToken }: TurnstileProps) {
  const container = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)
  const onTokenRef = useRef(onToken)
  useLayoutEffect(() => {
    onTokenRef.current = onToken
  })

  useEffect(() => {
    let cancelled = false
    loadScript()
      .then(() => {
        if (cancelled || !container.current || !window.turnstile) return
        widgetId.current = window.turnstile.render(container.current, {
          sitekey: siteKey,
          theme: 'light',
          callback: (token: string) => onTokenRef.current(token),
          'expired-callback': () => onTokenRef.current(null),
          'error-callback': () => onTokenRef.current(null),
        })
      })
      .catch(() => onTokenRef.current(null))
    return () => {
      cancelled = true
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current)
      widgetId.current = null
    }
  }, [siteKey])

  useEffect(() => {
    if (resetKey > 0 && widgetId.current && window.turnstile) {
      window.turnstile.reset(widgetId.current)
      onTokenRef.current(null)
    }
  }, [resetKey])

  return <div ref={container} className="min-h-[65px]" />
}
