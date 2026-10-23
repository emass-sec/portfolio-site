import { cloudflare } from '@cloudflare/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

// Injects canonical and Open Graph URL tags only when VITE_SITE_URL is set
// (in Workers Builds env vars), so the repo itself never names a domain.
function siteUrlTags(siteUrl: string | undefined): Plugin {
  return {
    name: 'site-url-tags',
    transformIndexHtml() {
      if (!siteUrl) return []
      const url = siteUrl.replace(/\/+$/, '') + '/'
      return [
        { tag: 'link', attrs: { rel: 'canonical', href: url }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:url', content: url }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:image', content: url + 'og-image.png' }, injectTo: 'head' },
      ]
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    plugins: [react(), tailwindcss(), cloudflare(), siteUrlTags(env.VITE_SITE_URL)],
    // The lazy-loaded Three.js chunk is ~900 kB minified (~245 kB gzip) by design.
    build: { chunkSizeWarningLimit: 1000 },
  }
})
