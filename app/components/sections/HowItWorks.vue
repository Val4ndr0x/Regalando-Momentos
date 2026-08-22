<script setup lang="ts">
import { PhGift, PhNotePencil, PhCalendarBlank, PhTruck } from '@phosphor-icons/vue'

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
</script>

<template>
  <section id="como-funciona" class="container py-[clamp(64px,10vw,120px)]">
    <div class="max-w-[46ch] mb-[clamp(40px,6vw,64px)]" v-reveal>
      <h2 class="text-[clamp(1.9rem,3.4vw,2.7rem)] mb-3.5">Sorprender a alguien no debería tomarte media tarde.</h2>
      <p class="text-(--ink-soft) text-[17px]">Cuatro pasos, quince minutos, y ya está en camino.</p>
    </div>

    <ol
      class="list-none m-0 p-0 grid grid-cols-4 gap-7 relative max-[900px]:grid-cols-1 max-[900px]:gap-9 before:content-[''] before:absolute before:top-[66px] before:left-[4%] before:right-[4%] before:h-px before:bg-(--line-strong) max-[900px]:before:top-0 max-[900px]:before:bottom-0 max-[900px]:before:left-[25px] max-[900px]:before:right-auto max-[900px]:before:w-px max-[900px]:before:h-auto"
    >
      <li
        v-for="(step, i) in steps"
        :key="step.title"
        class="relative pt-2 max-[900px]:pl-15"
        v-reveal="i"
      >
        <span class="block font-display font-extrabold text-[2.4rem] text-(--accent-tint-strong) mb-5 max-[900px]:absolute max-[900px]:left-0 max-[900px]:top-[-4px] max-[900px]:text-[1.3rem] max-[900px]:w-10">{{ String(i + 1).padStart(2, '0') }}</span>
        <span class="relative inline-flex items-center justify-center w-13 h-13 rounded-2xl bg-(--surface) border border-(--line) text-(--accent) mb-4.5 shadow-(--shadow-soft) max-[900px]:ml-0">
          <component :is="step.icon" :size="26" weight="bold" />
        </span>
        <h3 class="text-[1.1rem] mb-2">{{ step.title }}</h3>
        <p class="text-(--ink-soft) text-[15px] leading-[1.55] max-w-[28ch]">{{ step.body }}</p>
      </li>
    </ol>
  </section>
</template>
