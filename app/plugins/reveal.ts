// Scroll-reveal directive backed by IntersectionObserver (never a scroll listener).
// Usage: v-reveal or v-reveal="index" for a staggered delay.
export default defineNuxtPlugin((nuxtApp) => {
  let observer: IntersectionObserver | null = null

  if (typeof IntersectionObserver !== 'undefined') {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer?.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' }
    )
  }

  nuxtApp.vueApp.directive('reveal', {
    mounted(el: HTMLElement, binding) {
      el.classList.add('reveal')
      if (typeof binding.value === 'number') {
        el.style.transitionDelay = `${Math.min(binding.value * 90, 450)}ms`
      }
      if (observer) observer.observe(el)
      else el.classList.add('is-visible')
    },
    unmounted(el: HTMLElement) {
      observer?.unobserve(el)
    },
  })
})
