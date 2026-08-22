<script setup lang="ts">
import { PhGift } from '@phosphor-icons/vue'
import gsap from 'gsap'
import { products } from '~/data/products'

const BRAND = 'Regalando Momentos'

const showSplash = ref(false)
const rootEl = ref<HTMLElement | null>(null)
const randomImage = products[Math.floor(Math.random() * products.length)]!.image

const letters = BRAND.split('').map((char, i) => ({ char, i, isSpace: char === ' ' }))

let ctx: gsap.Context | null = null

onMounted(() => {
  // Se reproduce en cada carga/recarga de la página (no solo la primera vez):
  // es la "experiencia de regalo" de entrada, no un aviso puntual.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion) return

  showSplash.value = true
  document.documentElement.style.overflow = 'hidden'

  nextTick(() => {
    if (!rootEl.value) return
    ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from('.splash__logo', { scale: 0.4, opacity: 0, rotate: -20, duration: 0.55, ease: 'back.out(1.8)' })
        .from('.splash__image', { y: 26, opacity: 0, scale: 0.9, duration: 0.55 }, '-=0.2')
        .from(
          '.splash__letter',
          {
            opacity: 0,
            rotateX: -100,
            y: -8,
            duration: 0.45,
            stagger: 0.035,
            ease: 'back.out(1.7)',
            transformOrigin: '50% 100%',
          },
          '-=0.25'
        )
        .to({}, { duration: 0.5 }) // pequeña pausa para que se lea la marca antes de abrir la caja
        .add(closeLikeGiftBox)
    }, rootEl.value)
  })
})

function closeLikeGiftBox() {
  const tl = gsap.timeline({
    defaults: { ease: 'power3.inOut' },
    onComplete: () => {
      document.documentElement.style.overflow = ''
      showSplash.value = false
      ctx?.revert()
      ctx = null
    },
  })

  tl.to('.splash__content', { scale: 0.8, opacity: 0, duration: 0.4, ease: 'power2.in' })
    .to('.splash__flap--top', { rotateX: -112, duration: 0.85 }, '-=0.1')
    .to('.splash__flap--bottom', { rotateX: 112, duration: 0.85 }, '<')
    .to(rootEl.value, { opacity: 0, duration: 0.3 }, '-=0.25')

  return tl
}

onBeforeUnmount(() => {
  ctx?.revert()
  document.documentElement.style.overflow = ''
})
</script>

<template>
  <div
    v-if="showSplash"
    ref="rootEl"
    class="rm-splash fixed inset-0 z-200 perspective-[1400px]"
    role="status"
    aria-live="polite"
    aria-label="Cargando Regalando Momentos"
  >
    <div class="splash__flap splash__flap--top absolute inset-x-0 top-0 h-1/2 bg-(--ink) transform-3d will-change-transform" style="transform-origin: top center">
      <span class="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,var(--gold-light),var(--gold),var(--gold-light),transparent)]" aria-hidden="true" />
    </div>
    <div class="splash__flap splash__flap--bottom absolute inset-x-0 bottom-0 h-1/2 bg-(--ink) transform-3d will-change-transform" style="transform-origin: bottom center" />

    <div class="splash__content absolute inset-0 flex flex-col items-center justify-center gap-5 px-6">
      <span class="splash__logo opacity-0 inline-flex items-center justify-center w-16 h-16 rounded-pill bg-[color-mix(in_srgb,var(--gold)_16%,transparent)] text-(--gold) ring-1 ring-[color-mix(in_srgb,var(--gold)_45%,transparent)]">
        <PhGift :size="34" weight="fill" />
      </span>



      <p
        class="font-display font-extrabold text-[clamp(1.3rem,4vw,1.8rem)] text-(--gold) [text-shadow:0_0_22px_rgba(212,175,55,0.35)] perspective-[600px] flex flex-wrap justify-center"
        aria-hidden="true"
      >
        <span
          v-for="letter in letters"
          :key="letter.i"
          class="splash__letter inline-block will-change-transform"
          :class="letter.isSpace ? 'w-[0.32em]' : ''"
        >{{ letter.isSpace ? ' ' : letter.char }}</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Paleta dorada de la intro, aislada del resto del sitio (no forma parte de los
   tokens de marca en main.css): solo se usa para esta ventana "premium" de entrada. */
.rm-splash {
  --gold: #d4af37;
  --gold-light: #f3e3ac;
}
</style>
