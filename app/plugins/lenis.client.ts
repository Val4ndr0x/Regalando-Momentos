// Smooth-scroll driver for the whole site, ticked by GSAP so any GSAP
// tween (e.g. hero float/entrance) stays in sync with the scroll frame.
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default defineNuxtPlugin(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const lenis = new Lenis({
    duration: 1.1,
    smoothWheel: true,
  })

  // Manter ScrollTrigger en el mismo frame que el scroll de Lenis (si no, sus
  // animaciones basadas en scroll se desincronizan del resto de la página).
  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })
  gsap.ticker.lagSmoothing(0)

  return { provide: { lenis } }
})
