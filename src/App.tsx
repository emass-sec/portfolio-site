import { MotionConfig } from 'motion/react'
import { Footer } from './components/Footer'
import { Nav } from './components/Nav'
import { Contact } from './sections/Contact'
import { Hero } from './sections/Hero'
import { Services } from './sections/Services'

export default function App() {
  return (
    // "user" turns Motion animations off when the visitor prefers reduced motion.
    <MotionConfig reducedMotion="user">
      <a
        href="#services"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <Nav />
      <main>
        <Hero />
        <Services />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  )
}
