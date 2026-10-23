# portfolio-site

A single-page portfolio and services site: Vite + React + TypeScript, a
2D canvas hero animation, Motion animations, and a contact form backed
by a Cloudflare Worker with Turnstile spam protection. It deploys as one
Cloudflare Worker with static assets, with no server or database to run.

Everything specific to a deployment (domain, email addresses, API keys)
lives in Cloudflare settings and environment variables, never in the repo,
so you can fork it and deploy your own copy.

## Structure

```
src/content/      All site copy: edit these files to make the site yours
src/sections/     Hero, Services, Approach, About, Testimonials, Faq, CtaBand, Contact
src/components/   Nav, Logo, Icon, Section, Footer, ContactForm, Turnstile
src/hero/         The lazy-loaded "binary wind" mountain canvas
worker/index.ts   POST /api/contact: verifies Turnstile, emails via SMTP2GO
wrangler.jsonc    Worker config (no routes or domains)
public/_headers   Security headers and caching for static assets
```

## Local development

Requires Node 22+.

```sh
npm install
cp .env.example .env.local      # public build variables
cp .dev.vars.example .dev.vars  # Worker secrets for local dev
npm run dev
```

The example files use Cloudflare's Turnstile test keys, which always pass.
Without an `SMTP2GO_API_KEY` the form returns an error at the send step.

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with the Worker running in workerd |
| `npm run lint` | oxlint, warnings fail |
| `npm run build` | Typecheck, then build site and Worker into `dist/` |
| `npm run preview` | Build, then serve the production build locally |

## Configuration

**Build variables** (Vite, public, baked into the bundle):

| Name | Purpose |
| --- | --- |
| `VITE_TURNSTILE_SITE_KEY` | Turnstile widget site key |
| `VITE_SITE_URL` | Optional full site URL, used for canonical and Open Graph tags |

**Worker secrets** (`npx wrangler secret put <NAME>`):

| Name | Purpose |
| --- | --- |
| `TURNSTILE_SECRET` | Turnstile secret key |
| `SMTP2GO_API_KEY` | SMTP2GO API key with send permission |
| `CONTACT_TO` | Where submissions are delivered |
| `CONTACT_FROM` | Sender address, verified in SMTP2GO |

## Deploying to Cloudflare

1. In the Cloudflare dashboard, create a Turnstile widget for your hostname
   and note the site key and secret.
2. Go to Workers & Pages, create an application, and import this repo
   with Workers Builds. Build command `npm run build`, deploy command
   `npx wrangler deploy`.
3. In the Worker's build settings, add the build variables above.
4. Add the Worker secrets above (dashboard Settings > Variables and
   Secrets, or `wrangler secret put`).
5. Under Settings > Domains & Routes, add your custom domain. To redirect
   the apex to `www`, add a Redirect Rule on the zone.

Pushes to `main` deploy to production; other branches get preview URLs.

If a push doesn't start a build, check that the Cloudflare Workers and
Pages GitHub app has access to this repository (GitHub Settings >
Applications). Builds only run for pushes made after access is granted, so
push again once it is fixed.

## CI

`.github/workflows/ci.yml` runs lint and build on every PR and push to
`main`. If you set a `FORBIDDEN_STRINGS` repository secret (one string per
line, such as your domain or email), CI also fails when any of them appears
in tracked files. This keeps deployment details out of a public fork.

## License

MIT. See [LICENSE](LICENSE).
