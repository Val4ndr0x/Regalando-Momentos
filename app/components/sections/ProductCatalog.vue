<script setup lang="ts">
import { PhArrowUpRight } from '@phosphor-icons/vue'
import { categories } from '~/data/categories'
import { products } from '~/data/products'
import { waLink } from '~/data/site'
import GiftArt from '~/components/art/GiftArt.vue'

const selected = useSelectedCategory()

const filtered = computed(() => {
  if (selected.value === 'all') return products
  return products.filter((p) => p.categoryId === selected.value)
})

function categoryOf(id: string) {
  return categories.find((c) => c.id === id)!
}

function orderLink(name: string) {
  return waLink(`Hola! Quiero pedir: ${name}`)
}
</script>

<template>
  <section id="catalogo" class="container py-[clamp(64px,10vw,120px)]">
    <div class="max-w-[46ch] mb-8" v-reveal>
      <h2 class="text-[clamp(1.9rem,3.4vw,2.7rem)] mb-3.5">Cada ocasión tiene su regalo</h2>
      <p class="text-(--ink-soft) text-[17px]">Filtra por lo que estás celebrando y arma el pedido en un par de minutos.</p>
    </div>

    <div class="flex flex-wrap gap-2.5 mb-9" role="tablist" aria-label="Filtrar por categoría">
      <button
        type="button"
        class="border rounded-pill py-2.5 px-5 text-sm font-semibold transition-all duration-250 ease-[ease]"
        :class="selected === 'all'
          ? 'bg-(--ink) border-(--ink) text-(--bg)'
          : 'border-(--line-strong) bg-(--surface) text-(--ink-soft) hover:border-(--ink) hover:text-(--ink)'"
        @click="selected = 'all'"
      >
        Todos
      </button>
      <button
        v-for="cat in categories"
        :key="cat.id"
        type="button"
        class="border rounded-pill py-2.5 px-5 text-sm font-semibold transition-all duration-250 ease-[ease]"
        :class="selected === cat.id
          ? 'bg-(--ink) border-(--ink) text-(--bg)'
          : 'border-(--line-strong) bg-(--surface) text-(--ink-soft) hover:border-(--ink) hover:text-(--ink)'"
        @click="selected = cat.id"
      >
        {{ cat.name }}
      </button>
    </div>

    <div
      class="grid grid-cols-4 gap-5.5 max-[1080px]:grid-cols-2 max-[620px]:grid-cols-1"
      :class="selected === 'all' ? 'auto-rows-fr' : ''"
    >
      <article
        v-for="(product, i) in filtered"
        :key="product.id"
        class="flex flex-col bg-(--surface) rounded-card border border-(--line) overflow-hidden transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-(--shadow-soft)"
        :class="selected === 'all' && product.featured ? 'col-span-2 row-span-2 max-[1080px]:row-span-1 max-[620px]:col-span-1' : ''"
        :style="{ '--card-tint': categoryOf(product.categoryId).bgSoft }"
        v-reveal="i % 4"
      >
        <div
          class="bg-(--card-tint) p-7 flex items-center justify-center"
          :class="selected === 'all' && product.featured ? 'aspect-[16/10]' : 'aspect-[4/3]'"
        >
          <GiftArt :variant="categoryOf(product.categoryId).art" class="max-w-[62%]" />
        </div>
        <div class="p-5 flex flex-col gap-2 flex-1">
          <span class="text-xs font-bold text-(--accent) uppercase tracking-[0.04em]">{{ categoryOf(product.categoryId).name }}</span>
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
            <span class="font-bold text-[15px]">Desde ${{ product.price }}</span>
            <a
              class="inline-flex items-center gap-1 text-[13px] font-bold text-(--accent) hover:text-(--accent-dark)"
              :href="orderLink(product.name)"
              target="_blank"
              rel="noopener"
            >
              Elegir opciones
              <PhArrowUpRight :size="16" weight="bold" />
            </a>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
