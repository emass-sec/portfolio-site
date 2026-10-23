import { useState, type FormEvent } from 'react'
import { Turnstile } from './Turnstile'

type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent' } | { kind: 'error'; message: string }

const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined

const inputClass =
  'mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-slate-500 focus:border-accent-400 focus:outline-none'

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
      <div role="status" className="rounded-2xl border border-accent-400/30 bg-accent-400/5 p-8">
        <p className="font-display text-xl text-white">Thanks, your message is on its way.</p>
        <p className="mt-2 text-slate-400">I'll get back to you soon.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate={false}>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block text-sm text-slate-300">
          Name
          <input name="name" required maxLength={100} autoComplete="name" className={inputClass} />
        </label>
        <label className="block text-sm text-slate-300">
          Email
          <input name="email" type="email" required maxLength={254} autoComplete="email" className={inputClass} />
        </label>
      </div>
      <label className="block text-sm text-slate-300">
        Company <span className="text-slate-500">(optional)</span>
        <input name="company" maxLength={120} autoComplete="organization" className={inputClass} />
      </label>
      <label className="block text-sm text-slate-300">
        Message
        <textarea name="message" required rows={6} maxLength={5000} className={inputClass} />
      </label>

      {/* Honeypot for bots; hidden from people and assistive tech. */}
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {siteKey ? (
        <Turnstile siteKey={siteKey} resetKey={resetKey} onToken={setToken} />
      ) : (
        <p className="text-sm text-amber-400">VITE_TURNSTILE_SITE_KEY is not set, so the form cannot be verified.</p>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={!token || status.kind === 'sending'}
          className="rounded-full bg-accent-500 px-6 py-3 text-sm font-medium text-ink-950 transition hover:bg-accent-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status.kind === 'sending' ? 'Sending…' : 'Send message'}
        </button>
        {status.kind === 'error' && (
          <p role="alert" className="text-sm text-red-400">
            {status.message}
          </p>
        )}
      </div>
    </form>
  )
}
