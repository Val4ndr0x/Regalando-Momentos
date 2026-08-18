<script setup lang="ts">
import { PhClockCountdown, PhSealCheck, PhShieldCheck, PhHandHeart } from '@phosphor-icons/vue'

const items = [
  {
    icon: PhClockCountdown,
    title: 'Entrega el mismo día',
    body: 'Pides antes de la 1pm y llega hoy, en tu ciudad.',
  },
  {
    icon: PhSealCheck,
    title: 'Empaque que enamora',
    body: 'Cada pedido sale armado y envuelto a mano, listo para sorprender.',
  },
  {
    icon: PhShieldCheck,
    title: 'Pago cien por ciento seguro',
    body: 'Tarjeta, transferencia o efectivo contra entrega, como prefieras.',
  },
  {
    icon: PhHandHeart,
    title: 'Si algo falla, lo resolvemos',
    body: 'Soporte real por WhatsApp, no un bot que te deja esperando.',
  },
]
</script>

<template>
  <section class="border-y border-(--line) bg-(--surface)">
    <div class="container grid grid-cols-4 max-[900px]:grid-cols-1">
      <div
        v-for="(item, i) in items"
        :key="item.title"
        class="flex items-start gap-3.5 py-8 px-6 border-l border-(--line) first:border-l-0 max-[900px]:border-l-0 max-[900px]:border-t max-[900px]:px-0 max-[900px]:first:border-t-0"
        v-reveal="i"
      >
        <component :is="item.icon" :size="28" weight="bold" class="text-(--accent) shrink-0 mt-0.5" />
        <div>
          <h3 class="text-[15px] font-bold mb-1">{{ item.title }}</h3>
          <p class="text-sm text-(--ink-soft) leading-normal">{{ item.body }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
