<script setup lang="ts">
import type { Component } from 'vue'
import {
  PhArrowUpRight,
  PhSquaresFour,
  PhCoffee,
  PhHeart,
  PhCake,
  PhBasket,
  PhSparkle,
  PhX,
} from '@phosphor-icons/vue'
import { categories } from '~/data/categories'
import { products } from '~/data/products'
import { waLink } from '~/data/site'

const selected = useSelectedCategory()

const categoryIcons: Record<string, Component> = {
  desayunos: PhCoffee,
  romanticos: PhHeart,
  cumpleanos: PhCake,
  kits: PhBasket,
}

const audienceFilters = [
  { id: 'all', label: 'Todos' },
  { id: 'hombres', label: 'Ellos' },
  { id: 'mujeres', label: 'Ellas' },
]

const selectedAudience = ref('all')

function audienceOf(product: (typeof products)[number]) {
  const label = product.variants[0] ?? ''
  if (label.includes('Hombres')) return 'hombres'
  if (label.includes('Mujeres')) return 'mujeres'
  return 'bandejas'
}

const filtered = computed(() => {
  return products.filter((p) => {
    const matchesCategory = selected.value === 'all' || p.categoryId === selected.value
    const matchesAudience = selectedAudience.value === 'all' || audienceOf(p) === selectedAudience.value
    return matchesCategory && matchesAudience
  })
})

const hasActiveFilters = computed(() => selected.value !== 'all' || selectedAudience.value !== 'all')

function clearFilters() {
  selected.value = 'all'
  selectedAudience.value = 'all'
}

function categoryOf(id: string) {
  return categories.find((c) => c.id === id)!
}

function orderLink(name: string) {
  return waLink(`Hola! Quiero pedir: ${name}`)
}

function formatPrice(price: number) {
  return price.toLocaleString('es-CO')
}
</script>

<template>
  <section id="catalogo" class="py-[clamp(64px,10vw,120px)]">
    <div class="container">
      <div class="max-w-[46ch] mb-10" v-reveal>
        <span class="eyebrow">Catálogo</span>
        <h2 class="text-[clamp(1.9rem,3.4vw,2.7rem)] mt-2 mb-3.5">Cada ocasión tiene su regalo</h2>
        <p class="text-(--ink-soft) text-[17px]">Elige la ocasión y para quién es, y te mostramos justo lo que buscas.</p>
      </div>
    </div>

    <div class="sticky top-18 z-30 bg-[rgba(253,246,248,0.92)] [backdrop-filter:blur(14px)_saturate(160%)] border-y border-(--line) py-5 mb-10">
      <div class="container">
        <div class="flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
          <div class="flex flex-wrap gap-2.5" role="group" aria-label="Filtrar por ocasión">
            <button
              type="button"
              class="inline-flex items-center gap-1.5 border rounded-pill py-2.5 px-5 text-sm font-semibold transition-all duration-250 ease-[ease]"
              :class="selected === 'all'
                ? 'bg-(--ink) border-(--ink) text-(--bg)'
                : 'border-(--line-strong) bg-(--surface) text-(--ink-soft) hover:border-(--ink) hover:text-(--ink)'"
              :aria-pressed="selected === 'all'"
              @click="selected = 'all'"
            >
              <PhSquaresFour :size="16" weight="bold" />
              Todas
            </button>
            <button
              v-for="cat in categories"
              :key="cat.id"
              type="button"
              class="inline-flex items-center gap-1.5 border rounded-pill py-2.5 px-5 text-sm font-semibold transition-all duration-250 ease-[ease]"
              :class="selected === cat.id
                ? 'bg-(--ink) border-(--ink) text-(--bg)'
                : 'border-(--line-strong) bg-(--surface) text-(--ink-soft) hover:border-(--ink) hover:text-(--ink)'"
              :aria-pressed="selected === cat.id"
              @click="selected = cat.id"
            >
              <component :is="categoryIcons[cat.id]" :size="16" weight="bold" />
              {{ cat.name.replace('\n', ' ') }}
            </button>
          </div>

          <div class="flex items-center gap-2.5" role="group" aria-label="Filtrar por destinatario">
            <span class="text-xs font-bold text-(--ink-faint) uppercase tracking-[0.04em]">Para</span>
            <div class="inline-flex bg-(--bg-alt) rounded-pill p-1 gap-0.5">
              <button
                v-for="opt in audienceFilters"
                :key="opt.id"
                type="button"
                class="rounded-pill py-1.5 px-4 text-[13px] font-bold transition-all duration-250 ease-[ease]"
                :class="selectedAudience === opt.id
                  ? 'bg-(--surface) text-(--ink) shadow-[0_2px_8px_rgba(29,22,32,0.12)]'
                  : 'text-(--ink-soft) hover:text-(--ink)'"
                :aria-pressed="selectedAudience === opt.id"
                @click="selectedAudience = opt.id"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-4 mt-4">
          <p class="text-[13px] text-(--ink-soft)">
            <strong class="text-(--ink)">{{ filtered.length }}</strong>
            {{ filtered.length === 1 ? 'regalo encontrado' : 'regalos encontrados' }}
          </p>
          <button
            v-if="hasActiveFilters"
            type="button"
            class="inline-flex items-center gap-1 text-[13px] font-bold text-(--accent) hover:text-(--accent-dark)"
            @click="clearFilters"
          >
            <PhX :size="13" weight="bold" />
            Limpiar filtros
          </button>
        </div>
      </div>
    </div>

    <div class="container">
      <TransitionGroup
        v-if="filtered.length"
        tag="div"
        name="catalog-card"
        class="grid grid-cols-3 gap-5.5 max-[1080px]:grid-cols-2 max-[620px]:grid-cols-1"
        :class="selected === 'all' ? 'auto-rows-fr' : ''"
      >
        <article
          v-for="(product, i) in filtered"
          :key="product.id"
          class="group relative flex flex-col bg-(--surface) rounded-card border border-(--line) overflow-hidden transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-(--shadow-lift)"
          :class="selected === 'all' && product.featured ? 'col-span-2 row-span-2 max-[1080px]:row-span-1 max-[620px]:col-span-1' : ''"
          :style="{ '--card-tint': categoryOf(product.categoryId).bgSoft }"
          v-reveal="i % 4"
        >
          <span
            v-if="product.featured"
            class="absolute top-3.5 left-3.5 z-10 inline-flex items-center gap-1 rounded-pill bg-(--accent) text-(--on-accent) text-[11px] font-bold uppercase tracking-[0.04em] py-1.5 px-3 shadow-(--shadow-lift)"
          >
            <PhSparkle :size="12" weight="fill" />
            Más pedido
          </span>
          <div
            class="bg-(--card-tint) overflow-hidden p-4"
            :class="selected === 'all' && product.featured ? 'aspect-[16/10]' : 'aspect-[4/3]'"
          >
            <img
              :src="product.image"
              :alt="product.name"
              class="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div class="p-5 flex flex-col gap-2 flex-1">
            <span class="text-xs font-bold text-(--accent) uppercase tracking-[0.04em]">{{ categoryOf(product.categoryId).name.replace('\n', ' ') }}</span>
            <h3 class="text-[1.05rem]">{{ product.name }}</h3>
            <p class="text-sm text-(--ink-soft) leading-normal flex-1">{{ product.blurb }}</p>
            <div class="flex flex-wrap gap-1.5 mt-1">
              <span
                v-for="v in product.variants"
                :key="v"
                class="text-xs py-1 px-2.5 rounded-pill bg-(--bg-alt) text-(--ink-soft)"
              >{{ v }}</span>
            </div>
            <div class="flex items-center justify-between mt-3 pt-3 border-t border-(--line)">
              <span class="font-bold text-[15px]">Desde ${{ formatPrice(product.price) }}</span>
              <a
                class="inline-flex items-center gap-1 text-[13px] font-bold text-(--accent) hover:text-(--accent-dark)"
                :href="orderLink(product.name)"
                target="_blank"
                rel="noopener"
              >
                Pedir este regalo
                <PhArrowUpRight :size="16" weight="bold" />
              </a>
            </div>
          </div>
        </article>
      </TransitionGroup>

      <div v-else class="flex flex-col items-center text-center gap-4 py-20">
        <div class="w-16 h-16 rounded-full bg-(--bg-alt) flex items-center justify-center">
          <PhSquaresFour :size="26" weight="bold" class="text-(--ink-faint)" />
        </div>
        <div>
          <h3 class="text-[1.1rem] mb-1.5">No encontramos regalos con esa combinación</h3>
          <p class="text-(--ink-soft) text-sm max-w-[38ch]">Prueba con otra ocasión o cambia el destinatario.</p>
        </div>
        <button type="button" class="btn btn-ghost" @click="clearFilters">Ver todos los regalos</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* TransitionGroup enter/leave for the filtered grid — Vue toggles these
   class names itself, not expressible as static utility classes. */
.catalog-card-enter-active,
.catalog-card-leave-active,
.catalog-card-move {
  transition: opacity 0.35s var(--ease-out), transform 0.35s var(--ease-out);
}

.catalog-card-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.97);
}

.catalog-card-leave-to {
  opacity: 0;
  transform: scale(0.97);
}

.catalog-card-leave-active {
  position: absolute;
}
</style>
