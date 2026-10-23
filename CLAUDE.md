# CLAUDE.md

Single-page portfolio site deployed as one Cloudflare Worker with static assets.
See README.md for setup, configuration and deployment.

## Rules for this repo

- Never commit a real domain, email address, account ID or key. Domain binding
  lives in the Cloudflare dashboard; secrets are Worker secrets; public build
  values are `VITE_*` env vars. CI enforces this via `FORBIDDEN_STRINGS`.
- Personal operational notes go in `CLAUDE.local.md` (gitignored).
- One page only: sections are anchors (`#services`, `#projects`, `#about`,
  `#contact`). No client-side router.
- Site copy belongs in `src/content/`, not inline in components.
- Keep Three.js code under `src/three/` and lazy-loaded, so the first paint
  does not wait for it. Respect `prefers-reduced-motion`.
- The Worker only handles `/api/*` (`run_worker_first`); static assets never hit it.

## Checks before a PR

`npm run lint && npm run build`
