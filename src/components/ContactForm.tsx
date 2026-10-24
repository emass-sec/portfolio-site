import { useState, type FormEvent } from 'react'
import { contact } from '../content/contact'
import { Icon } from './Icon'
import { Turnstile } from './Turnstile'

type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent' } | { kind: 'error'; message: string }

const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined

const labelClass = 'flex flex-col gap-1.5 text-sm font-medium'
const inputClass =
  'rounded-xl border border-line-strong bg-field px-3.5 py-[13px] text-base font-normal text-ink placeholder:text-moss focus:border-forest focus:outline-none'

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const [token, setToken] = useState<string | null>(null)
  const [resetKey, setResetKey] = useState(0)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    setStatus({ kind: 'sending' })
    try {
      const res = await fetch('/api/contact', { method: 'POST', body: new FormData(form) })
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong. Please try again.')
      form.reset()
      setStatus({ kind: 'sent' })
    } catch (err) {
      setStatus({ kind: 'error', message: err instanceof Error ? err.message : 'Something went wrong.' })
    } finally {
      // Turnstile tokens are single use.
      setResetKey((k) => k + 1)
    }
  }

  if (status.kind === 'sent') {
    return (
      <div role="status" className="card-gloss rounded-3xl p-9">
        <p className="font-display text-xl font-semibold">{contact.sent.title}</p>
        <p className="mt-2 text-lichen">{contact.sent.body}</p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Contact form"
      className="flex flex-col gap-[18px] card-gloss rounded-3xl p-[clamp(24px,3vw,36px)]"
    >
      <div className="grid gap-3.5 sm:grid-cols-2">
        <label className={labelClass}>
          First name
          <input name="first" required maxLength={60} autoComplete="given-name" className={inputClass} />
        </label>
        <label className={labelClass}>
          Last name
          <input name="last" maxLength={60} autoComplete="family-name" className={inputClass} />
        </label>
      </div>
      <div className="grid gap-3.5 sm:grid-cols-2">
        <label className={labelClass}>
          Email
          <input name="email" type="email" required maxLength={254} autoComplete="email" className={inputClass} />
        </label>
        <label className={labelClass}>
          <span>
            Phone <span className="font-normal text-moss">(optional)</span>
          </span>
          <input name="phone" type="tel" maxLength={40} autoComplete="tel" className={inputClass} />
        </label>
      </div>
      <label className={labelClass}>
        Subject
        <input name="subject" maxLength={150} className={inputClass} />
      </label>
      <label className={labelClass}>
        Message
        <textarea name="message" required rows={5} maxLength={5000} className={`${inputClass} resize-y`} />
      </label>

      {/* Honeypot for bots; hidden from people and assistive tech. */}
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3.5 pt-1">
        {siteKey ? (
          <Turnstile siteKey={siteKey} resetKey={resetKey} onToken={setToken} />
        ) : (
          <p className="flex items-center gap-2.5 rounded-[10px] border border-dashed border-line-strong px-3.5 py-2.5 text-[13px] text-lichen">
            <Icon name="shieldCheck" size={18} />
            VITE_TURNSTILE_SITE_KEY is not set, so the form cannot be verified.
          </p>
        )}
        <button
          type="submit"
          disabled={!token || status.kind === 'sending'}
          className="rounded-full bg-forest px-7 py-[15px] text-base font-semibold text-white transition-colors hover:bg-pine disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status.kind === 'sending' ? 'Sending…' : 'Send message'}
        </button>
      </div>
      {status.kind === 'error' && (
        <p role="alert" className="text-sm text-red-700">
          {status.message}
        </p>
      )}
    </form>
  )
}
