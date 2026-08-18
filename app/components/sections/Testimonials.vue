<script setup lang="ts">
import { PhStar, PhCaretLeft, PhCaretRight, PhQuotes } from '@phosphor-icons/vue'

const testimonials = [
  {
    name: 'Renata Osorio',
    place: 'Coyoacán',
    avatar: 'https://i.pravatar.cc/120?img=47',
    quote:
      'Pedí el desayuno para mi mamá el día de su cumpleaños y lloró cuando abrió la puerta. Llegó justo a la hora que pedí.',
  },
  {
    name: 'Julián Beltrán',
    place: 'Guadalajara',
    avatar: 'https://i.pravatar.cc/120?img=12',
    quote:
      'Mandé flores a mi pareja sin avisar y la nota llegó exactamente como la escribí. Se nota que alguien la revisó antes.',
  },
  {
    name: 'Camila Duarte',
    place: 'Monterrey',
    avatar: 'https://i.pravatar.cc/120?img=32',
    quote:
      'El kit de spa fue el regalo perfecto para mi hermana después de un mes pesado. Todo llegó bien empacado.',
  },
  {
    name: 'Andrés Miramontes',
    place: 'Puebla',
    avatar: 'https://i.pravatar.cc/120?img=51',
    quote: 'Escribí por WhatsApp para cambiar la hora de entrega y me respondieron en minutos.',
  },
  {
    name: 'Paola Rincón',
    place: 'Querétaro',
    avatar: 'https://i.pravatar.cc/120?img=25',
    quote: 'El kit de cumpleaños trajo más de lo que esperaba. Mi hijo no dejó de hablar de los globos en días.',
  },
]

const track = ref<HTMLElement | null>(null)

function scrollByCard(dir: 1 | -1) {
  if (!track.value) return
  const card = track.value.querySelector('.t-card') as HTMLElement | null
  const amount = (card?.offsetWidth ?? 340) + 20
  track.value.scrollBy({ left: dir * amount, behavior: 'smooth' })
}
</script>

<template>
  <section class="py-[clamp(64px,10vw,120px)] bg-(--bg-alt)">
    <div class="container flex items-end justify-between gap-5 mb-8">
      <h2 class="text-[clamp(1.7rem,3vw,2.4rem)] max-w-[22ch]" v-reveal>Lo que dicen quienes ya regalaron un momento</h2>
      <div class="flex gap-2 shrink-0">
        <button
          type="button"
          class="w-11 h-11 rounded-pill border border-(--line-strong) bg-(--surface) inline-flex items-center justify-center text-(--ink) transition-[background-color,color] duration-250 ease-[ease] hover:bg-(--ink) hover:text-(--bg)"
          aria-label="Anterior"
          @click="scrollByCard(-1)"
        ><PhCaretLeft :size="18" weight="bold" /></button>
        <button
          type="button"
          class="w-11 h-11 rounded-pill border border-(--line-strong) bg-(--surface) inline-flex items-center justify-center text-(--ink) transition-[background-color,color] duration-250 ease-[ease] hover:bg-(--ink) hover:text-(--bg)"
          aria-label="Siguiente"
          @click="scrollByCard(1)"
        ><PhCaretRight :size="18" weight="bold" /></button>
      </div>
    </div>

    <div
      ref="track"
      class="container flex gap-5 overflow-x-auto snap-x snap-proximity pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden"
    >
      <article
        v-for="t in testimonials"
        :key="t.name"
        class="t-card snap-start grow-0 shrink-0 basis-[clamp(280px,34vw,340px)] bg-(--surface) rounded-card border border-(--line) p-6.5 flex flex-col"
      >
        <PhQuotes :size="26" weight="fill" class="text-(--accent-tint-strong) mb-2.5" />
        <div class="flex gap-0.75 text-(--accent) mb-3.5">
          <PhStar v-for="n in 5" :key="n" :size="14" weight="fill" />
        </div>
        <p class="text-[15px] leading-[1.6] text-(--ink) mb-5 flex-1">{{ t.quote }}</p>
        <div class="flex items-center gap-3">
          <img :src="t.avatar" :alt="t.name" width="40" height="40" loading="lazy" decoding="async" class="w-10 h-10 rounded-full object-cover" />
          <div class="flex flex-col text-[13px]">
            <strong class="text-sm">{{ t.name }}</strong>
            <span class="text-(--ink-soft)">{{ t.place }}</span>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
