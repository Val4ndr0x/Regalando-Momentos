<script setup lang="ts">
import { PhGift, PhNotePencil, PhCalendarBlank, PhTruck } from '@phosphor-icons/vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    icon: PhGift,
    title: 'Eliges tu regalo',
    body: 'Buscas por ocasión: desayuno, flores, cumpleaños o una bandeja para compartir.',
  },
  {
    icon: PhNotePencil,
    title: 'Nos cuentas qué quieres decir',
    body: 'Escribes la nota, eliges los extras y nos avisas si hay algo especial que debamos saber.',
  },
  {
    icon: PhCalendarBlank,
    title: 'Eliges el momento exacto',
    body: 'Programas la entrega para hoy mismo o para el día que de verdad importa.',
  },
  {
    icon: PhTruck,
    title: 'Nosotros llevamos la sorpresa',
    body: 'Entregamos en la puerta y te avisamos con una foto cuando ya está en sus manos.',
  },
]

const lastIndex = steps.length - 1

const sectionEl = ref<HTMLElement | null>(null)
const stageEl = ref<HTMLElement | null>(null)

// Progreso continuo 0..lastIndex: valor entero = ese paso ya apareció por completo.
// Cada paso, al llegarle su turno, aparece y se queda visible (no desaparece al
// avanzar al siguiente) — es un recorrido acumulativo, no un carrusel.
const progress = ref(0)

const activeIndex = computed(() => Math.max(0, Math.min(lastIndex, Math.floor(progress.value + 0.001))))
const lineFillPct = computed(() => (progress.value / lastIndex) * 100)
const truckLeftPct = computed(() => Math.min(98, Math.max(2, lineFillPct.value)))

function stepStyle(i: number) {
  const t = gsap.utils.clamp(0, 1, progress.value - i + 1)
  return {
    opacity: t.toFixed(3),
    transform: `translateY(${((1 - t) * 32).toFixed(1)}px)`,
  }
}

let ctx: gsap.Context | null = null
let scrollTrigger: ScrollTrigger | null = null

onMounted(() => {
  if (!sectionEl.value || !stageEl.value) return

  // Esta sección se mantiene animada (timeline + camión) siempre, incluso con
  // prefers-reduced-motion activado: es la pieza central de esta parte de la
  // página y se decidió que no tuviera una versión "apagada" alterna.

  // En móvil, el pin de ScrollTrigger se queda "atascado" en el primer paso
  // porque la barra de direcciones se oculta/muestra al hacer scroll y eso
  // dispara recálculos de altura a medio gesto. normalizeScroll + ignorar
  // esos resizes de la barra del navegador es el fix recomendado por GSAP
  // para pines que no avanzan (o tiemblan) en Safari/Chrome móvil.
  ScrollTrigger.normalizeScroll(true)
  ScrollTrigger.config({ ignoreMobileResize: true })

  ctx = gsap.context(() => {
    gsap.from('.how-it-works__intro', {
      x: -70,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.how-it-works__intro',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    })

    scrollTrigger = ScrollTrigger.create({
      trigger: stageEl.value,
      start: 'top top',
      end: () => `+=${window.innerHeight * lastIndex * 1.15}`,
      pin: true,
      anticipatePin: 1,
      scrub: true,
      onUpdate: (self) => {
        progress.value = self.progress * lastIndex
      },
    })
  }, sectionEl.value)
})

onBeforeUnmount(() => {
  scrollTrigger?.kill()
  ctx?.revert()
})
</script>

<template>
  <section ref="sectionEl" id="como-funciona" class="relative">
    <div class="container pt-[clamp(64px,10vw,120px)]">
      <div class="how-it-works__intro max-w-[46ch] mb-[clamp(24px,4vw,40px)]">
        <h2 class="text-[clamp(1.9rem,3.4vw,2.7rem)] mb-3.5">Haz que alguien sonría sin ni siquiera estar ahí.</h2>
        <p class="text-(--ink-soft) text-[17px]">Tú eliges las palabras, nosotros nos encargamos de que lleguen justo a tiempo.</p>
      </div>
    </div>

    <div ref="stageEl" class="relative h-dvh overflow-hidden flex items-center">
      <div class="container w-full">
        <p class="text-sm font-semibold text-(--accent) mb-[clamp(20px,3.5vw,32px)]">
          {{ String(activeIndex + 1).padStart(2, '0') }} / {{ String(steps.length).padStart(2, '0') }}
        </p>

        <div class="relative mb-[clamp(40px,6vw,64px)]">
          <div class="relative h-[3px] rounded-full bg-(--line-strong)">
            <div
              class="absolute inset-y-0 left-0 rounded-full bg-(--accent)"
              :style="{ width: `${lineFillPct}%` }"
            />
            <div
              class="absolute top-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-(--surface) border border-(--line) text-(--accent) shadow-(--shadow-soft) -translate-x-1/2 -translate-y-1/2 will-change-transform"
              :style="{ left: `${truckLeftPct}%` }"
            >
              <PhTruck :size="20" weight="bold" />
            </div>
          </div>
        </div>

        <ol class="list-none m-0 p-0 grid grid-cols-4 gap-[clamp(8px,2.5vw,28px)]">
          <li
            v-for="(step, i) in steps"
            :key="step.title"
            class="relative will-change-transform"
            :style="stepStyle(i)"
          >
            <span class="block font-display font-extrabold text-[clamp(1.05rem,3vw,2rem)] text-(--accent-tint-strong) mb-[clamp(6px,1.4vw,16px)]">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="relative inline-flex items-center justify-center w-[clamp(34px,8vw,52px)] h-[clamp(34px,8vw,52px)] rounded-2xl bg-(--surface) border border-(--line) text-(--accent) mb-[clamp(8px,1.6vw,18px)] shadow-(--shadow-soft)">
              <component :is="step.icon" :size="20" weight="bold" class="max-[900px]:w-[clamp(14px,3.6vw,26px)] max-[900px]:h-[clamp(14px,3.6vw,26px)]" />
            </span>
            <h3 class="text-[clamp(0.72rem,2vw,1.1rem)] mb-[clamp(4px,0.8vw,8px)] leading-[1.25]">{{ step.title }}</h3>
            <p class="hidden sm:block text-(--ink-soft) text-[15px] leading-[1.55] max-w-[28ch]">{{ step.body }}</p>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>
