<script setup lang="ts">
import { PhArrowsClockwise, PhCheck } from '@phosphor-icons/vue'
import { waLink } from '~/data/site'
import GiftArt from '~/components/art/GiftArt.vue'

const frequency = ref<'mes' | 'quincena'>('mes')

const perks = ['Cambia o cancela cuando quieras', 'Eliges el producto cada entrega', 'Recordatorio antes de cada envío']

const ctaLink = computed(() =>
  waLink(`Hola! Quiero activar entregas recurrentes cada ${frequency.value === 'mes' ? 'mes' : 'quincena'}`)
)
</script>

<template>
  <section id="suscripcion" class="bg-(--ink) text-(--bg) py-[clamp(64px,10vw,120px)]">
    <div class="container grid grid-cols-[1fr_0.8fr] gap-12 items-center max-[860px]:grid-cols-1">
      <div v-reveal>
        <span class="eyebrow text-(--accent-tint-strong)">Entregas recurrentes</span>
        <h2 class="text-[clamp(1.9rem,3.6vw,2.8rem)] mt-3.5 mx-0 mb-4 max-w-[16ch]">Que la sorpresa no dependa de que te acuerdes</h2>
        <p class="text-[rgba(253,246,248,0.72)] text-base max-w-[48ch] mb-7">
          Programa desayunos, flores o un pequeño gesto de forma recurrente y nosotros nos encargamos de que
          siempre llegue a tiempo.
        </p>

        <div class="inline-flex bg-[rgba(253,246,248,0.08)] rounded-pill p-1 mb-6 gap-1" role="group" aria-label="Frecuencia de entrega">
          <button
            type="button"
            class="bg-transparent border-0 py-2.5 px-5 rounded-pill text-sm font-semibold transition-[background-color,color] duration-250 ease-[ease]"
            :class="frequency === 'mes' ? 'bg-(--accent) text-(--on-accent)' : 'text-[rgba(253,246,248,0.7)]'"
            @click="frequency = 'mes'"
          >
            Cada mes
          </button>
          <button
            type="button"
            class="bg-transparent border-0 py-2.5 px-5 rounded-pill text-sm font-semibold transition-[background-color,color] duration-250 ease-[ease]"
            :class="frequency === 'quincena' ? 'bg-(--accent) text-(--on-accent)' : 'text-[rgba(253,246,248,0.7)]'"
            @click="frequency = 'quincena'"
          >
            Cada quincena
          </button>
        </div>

        <ul class="list-none mt-0 mx-0 mb-8 p-0 flex flex-col gap-2.5">
          <li v-for="perk in perks" :key="perk" class="flex items-center gap-2.5 text-[14.5px] text-[rgba(253,246,248,0.85)]">
            <PhCheck :size="16" weight="bold" class="text-(--accent-tint-strong) shrink-0" />
            {{ perk }}
          </li>
        </ul>

        <a class="btn btn-primary" :href="ctaLink" target="_blank" rel="noopener">
          Activar entregas recurrentes
          <PhArrowsClockwise :size="18" weight="bold" />
        </a>
      </div>

      <div class="flex justify-center max-[860px]:order-first">
        <div class="w-[min(100%,340px)] aspect-square rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(253,246,248,0.14),rgba(253,246,248,0.03))] border border-[rgba(253,246,248,0.14)] flex items-center justify-center p-10 max-[860px]:w-[min(70%,260px)]">
          <GiftArt variant="breakfast" />
        </div>
      </div>
    </div>
  </section>
</template>
