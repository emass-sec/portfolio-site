// Serves the contact form API. All other requests are static assets,
// which Cloudflare serves before this Worker runs (see run_worker_first).

interface Env {
  ASSETS: Fetcher
  TURNSTILE_SECRET: string
  SMTP2GO_API_KEY: string
  CONTACT_TO: string
  CONTACT_FROM: string
}

const LIMITS = { first: 60, last: 60, email: 254, phone: 40, subject: 150, message: 5000 }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  })
}

async function verifyTurnstile(token: string, ip: string | null, secret: string): Promise<boolean> {
  const form = new FormData()
  form.append('secret', secret)
  form.append('response', token)
  if (ip) form.append('remoteip', ip)
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: form,
  })
  if (!res.ok) return false
  const data = (await res.json()) as { success?: boolean }
  return data.success === true
}

async function sendEmail(env: Env, fields: Record<keyof typeof LIMITS, string>): Promise<boolean> {
  const name = `${fields.first} ${fields.last}`.trim()
  const text = [
    `Name: ${name}`,
    `Email: ${fields.email}`,
    fields.phone ? `Phone: ${fields.phone}` : null,
    fields.subject ? `Subject: ${fields.subject}` : null,
    '',
    fields.message,
  ]
    .filter((line) => line !== null)
    .join('\n')

  const res = await fetch('https://api.smtp2go.com/v3/email/send', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'X-Smtp2go-Api-Key': env.SMTP2GO_API_KEY },
    body: JSON.stringify({
      sender: env.CONTACT_FROM,
      to: [env.CONTACT_TO],
      subject: fields.subject ? `Website enquiry: ${fields.subject}` : `Website enquiry from ${name}`,
      text_body: text,
      custom_headers: [{ header: 'Reply-To', value: fields.email }],
    }),
  })
  return res.ok
}

async function handleContact(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return json({ error: 'Invalid form data' }, 400)
  }

  // Honeypot: real visitors never see or fill this field.
  if (String(form.get('website') ?? '') !== '') return json({ ok: true })

  const field = (key: string) => String(form.get(key) ?? '').trim()
  // Single-line fields end up in email headers, so line breaks are flattened.
  const line = (key: string) => field(key).replace(/[\r\n]+/g, ' ')
  const fields = {
    first: line('first'),
    last: line('last'),
    email: line('email'),
    phone: line('phone'),
    subject: line('subject'),
    message: field('message'),
  }
  if (!fields.first || !fields.message || !EMAIL_RE.test(fields.email)) {
    return json({ error: 'Please fill in your name, a valid email, and a message.' }, 400)
  }
  for (const key of Object.keys(LIMITS) as (keyof typeof LIMITS)[]) {
    if (fields[key].length > LIMITS[key]) return json({ error: `The ${key} field is too long.` }, 400)
  }

  const token = String(form.get('cf-turnstile-response') ?? '')
  const ip = request.headers.get('CF-Connecting-IP')
  try {
    if (!token || !(await verifyTurnstile(token, ip, env.TURNSTILE_SECRET))) {
      return json({ error: 'Verification failed. Please try again.' }, 403)
    }
    if (!(await sendEmail(env, fields))) throw new Error('Email provider rejected the request')
  } catch (err) {
    console.error('contact form failed', err)
    return json({ error: 'Your message could not be sent. Please try again later.' }, 502)
  }
  return json({ ok: true })
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    if (url.pathname === '/api/contact') return handleContact(request, env)
    if (url.pathname.startsWith('/api/')) return json({ error: 'Not found' }, 404)
    return env.ASSETS.fetch(request)
  },
} satisfies ExportedHandler<Env>
