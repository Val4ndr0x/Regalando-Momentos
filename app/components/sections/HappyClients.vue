<script setup lang="ts">
import gsap from 'gsap'
import type { ComponentPublicInstance } from 'vue'
import { categories } from '~/data/categories'
import client1 from '~/assets/moments/client1.jpeg'
import client2 from '~/assets/moments/client2.jpeg'
import client3 from '~/assets/moments/client3.jpeg'
import client4 from '~/assets/moments/client4.jpeg'

// Una foto real de cliente por categoría, en el mismo orden que la pila de tarjetas.
const clientImages: Record<string, string> = {
  desayunos: client1,
  romanticos: client2,
  cumpleanos: client3,
  kits: client4,
}

// Orden de visualización de la pila: order[0] es la tarjeta al frente (revelada).
// Al "lanzarla" pasa al fondo de la pila y la siguiente queda al frente.
const order = ref<string[]>(categories.map((c) => c.id))
const frontId = computed(() => order.value[0])

const cardEls: Record<string, HTMLElement> = {}
function setCardRef(id: string, el: Element | ComponentPublicInstance | null) {
  if (el) cardEls[id] = el as HTMLElement
}

const stageEl = ref<HTMLElement | null>(null)

const STACK_INTERVAL_MS = 4200
const THROW_DURATION = 0.55
const SETTLE_DURATION = 0.65

let timer: ReturnType<typeof setInterval> | null = null
let visibilityObserver: IntersectionObserver | null = null
let reduceMotion = false

// Posición de cada tarjeta en la pila según su índice (0 = frente, grande y nítida;
// las siguientes se ven detrás, más pequeñas, giradas e inclinadas alternando lados,
// simulando un mazo de fotos apiladas.
function layoutFor(position: number) {
  const sign = position % 2 === 0 ? 1 : -1
  return {
    x: position === 0 ? 0 : sign * (10 + position * 6),
    y: position * 16,
    scale: Math.max(0.82, 1 - position * 0.06),
    rotation: position === 0 ? 0 : sign * (5 + position * 2),
    opacity: position === 0 ? 1 : Math.max(0.2, 0.62 - (position - 1) * 0.2),
    zIndex: 100 - position,
  }
}

function applyLayoutInstant() {
  order.value.forEach((id, position) => {
    const el = cardEls[id]
    if (el) gsap.set(el, layoutFor(position))
  })
}

// Anima la tarjeta del frente como si alguien la lanzara lejos (desliza, gira y se
// desvanece), y al terminar la reinserta al fondo de la pila mientras el resto avanza
// una posición hacia el frente.
function throwFront() {
  const id = frontId.value
  const el = id ? cardEls[id] : null
  if (!id || !el) return

  if (reduceMotion) {
    order.value = [...order.value.slice(1), id]
    applyLayoutInstant()
    return
  }

  gsap.to(el, {
    x: '+=480',
    y: '-=90',
    rotation: 28,
    opacity: 0,
    duration: THROW_DURATION,
    ease: 'power2.in',
    onComplete: () => {
      order.value = [...order.value.slice(1), id]
      const backPosition = order.value.length - 1
      gsap.set(el, { ...layoutFor(backPosition), opacity: 0 })
      order.value.forEach((cardId, position) => {
        const cardEl = cardEls[cardId]
        if (!cardEl) return
        gsap.to(cardEl, { ...layoutFor(position), duration: SETTLE_DURATION, ease: 'power3.out' })
      })
    },
  })
}

function startLoop() {
  stopLoop()
  if (reduceMotion) return
  timer = setInterval(throwFront, STACK_INTERVAL_MS)
}

function stopLoop() {
  if (timer) clearInterval(timer)
  timer = null
}

onMounted(() => {
  reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  applyLayoutInstant()

  visibilityObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) startLoop()
      else stopLoop()
    },
    { threshold: 0.35 }
  )
  if (stageEl.value) visibilityObserver.observe(stageEl.value)
})

onBeforeUnmount(() => {
  stopLoop()
  visibilityObserver?.disconnect()
})
</script>

<template>
  <section class="py-[clamp(64px,10vw,120px)] bg-(--bg-alt) overflow-hidden">
    <div class="container max-w-[52ch] mb-12 text-center mx-auto" v-reveal>
      <span class="eyebrow">Clientes felices</span>
      <h2 class="text-[clamp(1.9rem,3.4vw,2.7rem)] mt-2.5">Así se ven los momentos que ya regalamos</h2>
      <p class="text-(--ink-soft) text-[17px] mt-3">
        Una postal por categoría, tal como las comparten quienes ya recibieron su regalo.
      </p>
    </div>

    <div
      ref="stageEl"
      class="relative mx-auto w-[min(88vw,340px)] h-[clamp(440px,58vw,520px)]"
    >
      <div
        v-for="cat in categories"
        :key="cat.id"
        :ref="(el) => setCardRef(cat.id, el)"
        class="absolute inset-0 will-change-transform"
      >
        <InstaLikeCard :category="cat" :active="cat.id === frontId" :client-image="clientImages[cat.id] ?? client1" />
      </div>
    </div>
  </section>
</template>
