<script setup lang="ts">
import { PhArrowRight, PhCoffee, PhHeart, PhConfetti, PhLeaf } from '@phosphor-icons/vue'
import gsap from 'gsap'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import type { ComponentPublicInstance } from 'vue'
import { categories } from '~/data/categories'

gsap.registerPlugin(InertiaPlugin)

const decorIcon = { breakfast: PhCoffee, flowers: PhHeart, birthday: PhConfetti, kit: PhLeaf }

const stageEl = ref<HTMLElement | null>(null)
const trackEl = ref<HTMLElement | null>(null)

const jsActive = ref(false)
const activeIndex = ref(0)
const dragPx = ref(0)
const stageWidth = ref(1)

let startX = 0
let startY = 0
let pointerId: number | null = null
let axisLock: 'x' | 'y' | null = null
let baseDragAtStart = 0
let reduceMotion = false

// Ventana de muestras recientes {x, t} usada para promediar la velocidad real del
// gesto al soltar. Usar solo el último delta de pointermove es poco fiable: si el
// cursor se frena un instante justo antes de soltar (algo habitual al final de un
// flick), ese delta da ~0 y el inertia "salta" en vez de deslizar.
const VELOCITY_WINDOW_MS = 100
let velocityLog: { x: number; t: number }[] = []

let resizeObserver: ResizeObserver | null = null
let visibilityObserver: IntersectionObserver | null = null
let heroCtx: gsap.Context | null = null
let settleTween: ReturnType<typeof gsap.to> | null = null
let floatTweens: gsap.core.Tween[] = []

// Amplitud (px) y duración (s) del loop de flotación ambiente de cada PNG del hero.
// Subir el número de px = más exagerado; bajar duración = flota más rápido/seguido.
const FLOAT_PRODUCT_PX = 40
const FLOAT_PRODUCT_DURATION = 2.6
const FLOAT_DECOR2_PX = 32
const FLOAT_DECOR2_DURATION = 2.3

onMounted(() => {
  jsActive.value = true
  if (stageEl.value) {
    stageWidth.value = stageEl.value.clientWidth
    syncTransforms()
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) stageWidth.value = entry.contentRect.width
      syncTransforms()
    })
    resizeObserver.observe(stageEl.value)
  }

  reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!reduceMotion && stageEl.value) {
    heroCtx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from('.hero__bgtype-inner', { x: -140, opacity: 0, duration: 1.1 }, 0)
        .from('.hero__product-inner', { y: 130, opacity: 0, scale: 0.85, duration: 1, ease: 'back.out(1.5)' }, 0.15)
        .from('.hero__decor-inner', { x: 110, y: -50, opacity: 0, rotate: -18, duration: 0.9 }, 0.3)
        .from('.hero__decor2-inner', { y: 40, opacity: 0, duration: 0.9 }, 0.3)
        .from('.hero__menu-item', { y: 20, opacity: 0, duration: 0.6, stagger: 0.08 }, 0.5)
        .from('.hero__cta', { y: 20, opacity: 0, scale: 0.92, duration: 0.6 }, 0.6)
        .add(() => {
          // Flotación ambiente continua para las imágenes PNG del hero (producto y
          // decor2, una por cada una de las 4 categorías en /public). Amplitud y
          // duración se controlan arriba en FLOAT_PRODUCT_PX/DURATION y
          // FLOAT_DECOR2_PX/DURATION.
          floatTweens = [
            gsap.to('.hero__product-inner', {
              y: `+=${FLOAT_PRODUCT_PX}`,
              duration: FLOAT_PRODUCT_DURATION,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
              stagger: { each: 0.35, from: 'random' },
            }),
            gsap.to('.hero__decor2-inner', {
              y: `+=${FLOAT_DECOR2_PX}`,
              duration: FLOAT_DECOR2_DURATION,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
              stagger: { each: 0.3, from: 'random' },
            }),
            gsap.to('.hero__decor-inner', {
              y: '-=14',
              rotate: '+=4',
              duration: 3.2,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
              stagger: { each: 0.4, from: 'random' },
            }),
          ]
        })
    }, stageEl.value)

    // Los tweens de flotación son infinitos (repeat: -1): si se dejan corriendo
    // fuera de pantalla siguen consumiendo frame budget y le restan fluidez al
    // scroll del resto de la página. Se pausan cuando el hero sale del viewport
    // y se retoman al volver a entrar.
    visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        for (const tween of floatTweens) {
          if (entry.isIntersecting) tween.resume()
          else tween.pause()
        }
      },
      { threshold: 0 }
    )
    visibilityObserver.observe(stageEl.value)
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  visibilityObserver?.disconnect()
  heroCtx?.revert()
  settleTween?.kill()
})

function clampDrag(raw: number) {
  if (activeIndex.value === 0 && raw > 0) return raw * 0.35
  if (activeIndex.value === categories.length - 1 && raw < 0) return raw * 0.35
  return raw
}

function onPointerDown(e: PointerEvent) {
  if (e.pointerType === 'mouse' && e.button !== 0) return
  settleTween?.kill()
  settleTween = null
  pointerId = e.pointerId
  startX = e.clientX
  startY = e.clientY
  axisLock = null
  baseDragAtStart = dragPx.value
  velocityLog = [{ x: e.clientX, t: performance.now() }]
}

function onPointerMove(e: PointerEvent) {
  if (pointerId === null || e.pointerId !== pointerId) return
  const dx = e.clientX - startX
  const dy = e.clientY - startY

  if (axisLock === null) {
    if (Math.abs(dx) > 7 || Math.abs(dy) > 7) {
      axisLock = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
      if (axisLock === 'x') {
        ;(e.target as HTMLElement).setPointerCapture?.(pointerId)
      }
    }
  }

  if (axisLock === 'x') {
    e.preventDefault()
    dragPx.value = clampDrag(baseDragAtStart + dx)
    syncTransforms()
    pushVelocitySample(e.clientX)
  }
}

function pushVelocitySample(x: number) {
  const now = performance.now()
  velocityLog.push({ x, t: now })
  while (velocityLog.length > 2 && now - velocityLog[0]!.t > VELOCITY_WINDOW_MS) velocityLog.shift()
}

// Velocidad media del gesto en la ventana reciente (no solo el último delta de
// pointermove, que puede ser ~0 si el cursor se frenó justo antes de soltar).
function releaseVelocity(): number {
  if (velocityLog.length < 2) return 0
  const first = velocityLog[0]!
  const last = velocityLog[velocityLog.length - 1]!
  const dt = last.t - first.t
  return dt > 0 ? (last.x - first.x) / dt : 0
}

// Curva con leve rebote (overshoot) para navegación por clic (sin velocidad de arrastre real).
const SETTLE_EASE = 'back.out(1.5)'
const SETTLE_MIN_DURATION = 0.42
const SETTLE_MAX_DURATION = 0.95

function endDrag(e: PointerEvent) {
  if (pointerId === null || e.pointerId !== pointerId) return
  if (axisLock === 'x') {
    pushVelocitySample(e.clientX)
    flingTo(releaseVelocity())
  }
  pointerId = null
  axisLock = null
}

// Índices de slide válidos a los que se puede "aterrizar" desde el índice activo actual
// (el propio, el anterior y el siguiente), junto con el desplazamiento de dragPx que
// representa mostrar cada uno de ellos.
function neighborTargets() {
  const indices = [...new Set([
    Math.max(0, activeIndex.value - 1),
    activeIndex.value,
    Math.min(categories.length - 1, activeIndex.value + 1),
  ])]
  return indices.map((i) => ({ index: i, px: (activeIndex.value - i) * stageWidth.value }))
}

// Al soltar el arrastre, el slide continúa con la misma velocidad e inercia del cursor
// (en vez de arrancar desde una curva de easing artificial) y frena de forma natural hasta
// "aterrizar" en el slide anterior/actual/siguiente, el que quede más cerca de esa trayectoria.
function flingTo(velocityPxPerMs: number) {
  settleTween?.kill()
  const targets = neighborTargets()

  if (reduceMotion) {
    // Incluso con reduced-motion, no cortamos el gesto en seco: seguimos desde dragPx
    // actual con una transición corta y sin rebote (evita el salto visual, pero sin la
    // física elaborada que la preferencia de accesibilidad pide reducir).
    const landed = targets.reduce((best, t) =>
      Math.abs(t.px - dragPx.value) < Math.abs(best.px - dragPx.value) ? t : best)
    settleTween = gsap.to(dragPx, {
      value: landed.px,
      duration: 0.2,
      ease: 'power2.out',
      onUpdate: syncTransforms,
      onComplete: () => {
        activeIndex.value = landed.index
        dragPx.value = 0
        settleTween = null
        syncTransforms()
      },
    })
    return
  }

  settleTween = gsap.to(dragPx, {
    inertia: {
      value: { velocity: velocityPxPerMs * 1000, end: targets.map((t) => t.px) },
      duration: { min: 0.3, max: 0.85 },
    },
    onUpdate: syncTransforms,
    onComplete: () => {
      const finalPx = dragPx.value
      const landed = targets.reduce((best, t) =>
        Math.abs(t.px - finalPx) < Math.abs(best.px - finalPx) ? t : best)
      activeIndex.value = landed.index
      dragPx.value = 0
      settleTween = null
      syncTransforms()
    },
  })
}

// Ease de un solo `dragPx` con GSAP (mismo reloj que Lenis/el timeline de entrada) para que
// track, capas de parallax y color de fondo avancen en el mismo frame — sin esto, la
// transición CSS corría en su propio timeline y se desincronizaba, cortando el parallax.
function goTo(index: number) {
  const target = Math.max(0, Math.min(categories.length - 1, index))
  const targetDragPx = (activeIndex.value - target) * stageWidth.value

  settleTween?.kill()

  if (Math.abs(targetDragPx - dragPx.value) < 0.5 || reduceMotion) {
    activeIndex.value = target
    dragPx.value = 0
    settleTween = null
    syncTransforms()
    return
  }

  const normalized = stageWidth.value ? gsap.utils.clamp(0, 1, Math.abs(targetDragPx - dragPx.value) / stageWidth.value) : 0
  const duration = gsap.utils.clamp(SETTLE_MIN_DURATION, SETTLE_MAX_DURATION, 0.55 + normalized * 0.35)

  settleTween = gsap.to(dragPx, {
    value: targetDragPx,
    duration,
    ease: SETTLE_EASE,
    onUpdate: syncTransforms,
    onComplete: () => {
      activeIndex.value = target
      dragPx.value = 0
      settleTween = null
      syncTransforms()
    },
  })
}

const progress = computed(() => activeIndex.value - dragPx.value / stageWidth.value)

const displayIndex = computed(() => Math.max(0, Math.min(categories.length - 1, Math.round(progress.value))))

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

const heroBg = computed(() => {
  const p = Math.max(0, Math.min(categories.length - 1, progress.value))
  const i0 = Math.floor(p)
  const i1 = Math.min(categories.length - 1, i0 + 1)
  const t = p - i0
  const [r0, g0, b0] = hexToRgb(categories[i0]!.bg)
  const [r1, g1, b1] = hexToRgb(categories[i1]!.bg)
  const r = Math.round(r0 + (r1 - r0) * t)
  const g = Math.round(g0 + (g1 - g0) * t)
  const b = Math.round(b0 + (b1 - b0) * t)
  return `rgb(${r}, ${g}, ${b})`
})

// Las capas de parallax se mueven escribiendo `transform` directo al DOM (no vía :style
// reactivo de Vue). Animar dragPx con GSAP mutaba un ref en cada tick, y eso obligaba a Vue
// a re-renderizar/diffear los ~15 elementos de las 4 slides en cada frame — con eso el
// settle (fling/goTo) se veía entrecortado en vez de fluido. Escribiendo el transform a mano
// en el mismo onUpdate de GSAP se evita ese costo por completo.
const bgtypeWrapEls: (HTMLElement | null)[] = []
const productWrapEls: (HTMLElement | null)[] = []
const decorWrapEls: (HTMLElement | null)[] = []
const decor2WrapEls: (HTMLElement | null)[] = []

function setLayerRef(arr: (HTMLElement | null)[], i: number, el: Element | ComponentPublicInstance | null) {
  arr[i] = (el as HTMLElement) ?? null
}

const LAYER_SPEED_BGTYPE = 0.3
const LAYER_SPEED_PRODUCT = 0.6
const LAYER_SPEED_DECOR = 0.9
const LAYER_SPEED_DECOR2 = 0.75

function syncTransforms() {
  if (!jsActive.value) return
  const px = dragPx.value
  const idx = activeIndex.value
  const width = stageWidth.value
  if (trackEl.value) {
    trackEl.value.style.transform = `translateX(${-idx * width + px}px)`
  }
  // Cada capa de parallax se desplaza en función de la distancia de SU propio slide al
  // progreso continuo del drag (no del `px` crudo aplicado por igual a todos los slides).
  // `progress` se mantiene continuo incluso en el instante en que activeIndex salta y dragPx
  // se resetea a 0 al aterrizar (fling/goTo), así que usar (i - progress) evita el "corte"
  // visual que se veía al soltar: antes, el offset de estas capas dependía solo de px, que sí
  // saltaba de golpe a 0 en ese mismo instante mientras activeIndex cambiaba para compensarlo.
  const progress = idx - px / width
  for (let i = 0; i < categories.length; i++) {
    const delta = (i - progress) * width
    const bgtype = bgtypeWrapEls[i]
    if (bgtype) bgtype.style.transform = `translateX(${delta * (LAYER_SPEED_BGTYPE - 1)}px)`
    const product = productWrapEls[i]
    if (product) product.style.transform = `translateX(${delta * (LAYER_SPEED_PRODUCT - 1)}px)`
    const decor = decorWrapEls[i]
    if (decor) decor.style.transform = `translateX(${delta * (LAYER_SPEED_DECOR - 1)}px)`
    const decor2 = decor2WrapEls[i]
    if (decor2) decor2.style.transform = `translateX(${delta * (LAYER_SPEED_DECOR2 - 1)}px)`
  }
}

</script>

<template>
  <section
    ref="stageEl"
    class="relative min-h-dvh overflow-hidden touch-pan-y transition-[background-color] duration-600 ease-out bg-(--hero-bg)"
    :class="jsActive ? '' : 'overflow-x-auto snap-x snap-mandatory [-webkit-overflow-scrolling:touch]'"
    :style="{ '--hero-bg': jsActive ? heroBg : categories[0]!.bg }"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="endDrag"
    @pointercancel="endDrag"
  >
    <div
      ref="trackEl"
      class="flex w-full h-dvh"
      :class="jsActive ? 'will-change-transform' : ''"
    >
      <article
        v-for="(cat, i) in categories"
        :key="cat.id"
        class="relative flex-none w-full h-full overflow-hidden snap-center flex items-end justify-start pt-[clamp(90px,14vh,160px)] px-[clamp(20px,6vw,80px)] pb-[clamp(140px,20vh,200px)] max-md:items-end max-md:pb-[clamp(190px,34vh,260px)]"
        :style="{ '--cat-ink': cat.ink }"
      >
        <div
          class="absolute inset-0 flex items-center justify-center pointer-events-none z-0 will-change-transform"
          :ref="(el) => setLayerRef(bgtypeWrapEls, i, el)"
          aria-hidden="true"
        >
          <span
            class="font-display font-extrabold text-[clamp(3.2rem,08vw,10.5rem)] text-[color-mix(in_srgb,var(--cat-ink)_18%,transparent)] whitespace-pre-line text-center leading-[0.95] ml-[2em] tracking-[-0.02em] select-none"
          >
            <span class="hero__bgtype-inner text-start inline-block will-change-transform">{{ cat.heroLabel ?? cat.name }}</span>
          </span>
        </div>

        <div
          class="relative z-2 w-[clamp(220px,30vw,440px)] aspect-square drop-shadow-[0_30px_40px_rgba(0,0,0,0.15)] will-change-transform"
          :ref="(el) => setLayerRef(productWrapEls, i, el)"
        >
          <div class="hero__product-inner w-full h-full will-change-transform">
            <img
              :src="cat.productImage"
              :alt="cat.name"
              class="w-full h-full object-contain object-bottom block [-webkit-user-drag:none] select-none"
              loading="eager"
              decoding="async"
              fetchpriority="high"
              draggable="false"
              @dragstart.prevent
            />
          </div>
        </div>

        <div
          class="absolute right-[clamp(30px,8vw,120px)] top-[20%] z-1 opacity-85 origin-center will-change-transform text-[color-mix(in_srgb,var(--cat-ink)_55%,transparent)]"
          :ref="(el) => setLayerRef(decorWrapEls, i, el)"
          aria-hidden="true"
        >
          <div class="hero__decor-inner inline-flex will-change-transform">
            <component :is="decorIcon[cat.art]" :size="72" weight="fill" />
          </div>
        </div>

        <div
          v-if="cat.decorImage"
          class="absolute left-[clamp(24px,9vw,130px)] top-[clamp(70px,12vh,130px)] z-1 w-[clamp(300px,68vw,150px)] opacity-[0.92] origin-center will-change-transform"
          :ref="(el) => setLayerRef(decor2WrapEls, i, el)"
          aria-hidden="true"
        >
          <div class="hero__decor2-inner inline-flex will-change-transform">
            <img
              :src="cat.decorImage"
              :alt="''"
              class="w-full h-auto block drop-shadow-[0_14px_20px_rgba(0,0,0,0.12)] [-webkit-user-drag:none] select-none"
              loading="eager"
              decoding="async"
              draggable="false"
              @dragstart.prevent
            />
          </div>
        </div>

        <p
          class="hidden md:block absolute left-[clamp(20px,6vw,80px)] bottom-[clamp(46px,-15vh,140px)] max-w-[30ch] text-xl font-medium z-2 transition-[opacity,transform] duration-500 ease-[ease] text-(--cat-ink)"
          :class="i === displayIndex ? 'opacity-[0.92] translate-y-0' : 'opacity-0 translate-y-[10px]'"
        >
          {{ cat.tagline }}
        </p>
      </article>
    </div>

    <div
      class="absolute inset-0 flex items-end justify-between gap-5 px-[clamp(20px,6vw,80px)] pb-[clamp(36px,6vh,56px)] pointer-events-none z-3 max-md:flex-col max-md:items-start max-md:justify-end max-md:gap-[18px]"
    >
      <nav
        class="flex flex-wrap gap-[clamp(14px,2.4vw,28px)] pointer-events-auto max-md:gap-x-[18px] max-md:gap-y-3"
        aria-label="Categorías de regalo"
      >
        <button
          v-for="(cat, i) in categories"
          :key="cat.id"
          type="button"
          class="hero__menu-item bg-transparent border-0 py-1 px-0 text-sm border-b-2 transition-[opacity,border-color,color] duration-300 ease-[ease]"
          :class="i === displayIndex
            ? 'opacity-100 font-bold text-(--ink) border-b-(--ink)'
            : 'opacity-65 font-semibold text-[color-mix(in_srgb,var(--ink)_55%,transparent)] border-b-transparent'"
          @click="goTo(i)"
        >
          {{ cat.name }}
        </button>
      </nav>

      <a
        class="hero__cta btn pointer-events-auto shrink-0 bg-(--ink) text-(--bg) hover:bg-(--accent-dark) hover:-translate-y-0.5"
        href="#catalogo"
      >
        Descubrir
        <PhArrowRight :size="18" weight="bold" />
      </a>
    </div>
  </section>
</template>
