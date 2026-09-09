<script setup lang="ts">
import { PhList, PhX, PhWhatsappLogo } from '@phosphor-icons/vue'
import { waLink } from '~/data/site'
import logoIcon from '~/assets/iconos/icon.png'

const scrolled = ref(false)
const menuOpen = ref(false)
const sentinel = ref<HTMLElement | null>(null)

let observer: IntersectionObserver | null = null

onMounted(() => {
  if (sentinel.value && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(([entry]) => {
      if (entry) scrolled.value = !entry.isIntersecting
    })
    observer.observe(sentinel.value)
  }
})

onBeforeUnmount(() => observer?.disconnect())

const links = [
{ href: '#inicio', label: 'Inicio' },
  { href: '#regalos', label: 'Regalos' },
  { href: '#bandejas', label: 'Bandejas de sabores' },
  { href: '#historias', label: 'Historias' },
  { href: '#quienes-somos', label: 'Quiénes somos' },
]

function closeMenu() {
  menuOpen.value = false
}
</script>

<template>
  <div ref="sentinel" class="absolute top-0 h-px w-px" aria-hidden="true" />
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-[background-color,box-shadow] duration-350 ease-[ease]"
    :class="scrolled ? 'bg-[rgba(253,246,248,0.88)] [backdrop-filter:blur(14px)_saturate(160%)] shadow-[0_1px_0_var(--line)]' : ''"
  >
    <div class="container flex items-center justify-between gap-6 h-18">
      <a href="#top" class="flex items-center gap-2 font-display font-extrabold text-lg tracking-[-0.01em] text-(--ink) shrink-0">
        <img :src="logoIcon" alt="Regalando Momentos" class="h-16 w-16 shrink-0 mx-4" />
        <span>Regalando <span class=" text-yellow-700">Momentos</span></span>
      </a>

      <nav class="flex items-center gap-7 text-sm font-semibold flex-1 justify-center max-[860px]:hidden" aria-label="Principal">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="text-(--ink) opacity-75 transition-opacity duration-250 ease-[ease] hover:opacity-100"
        >{{ link.label }}</a>
      </nav>

      <div class="flex items-center gap-3 shrink-0">
        <a
          class="inline-flex items-center justify-center w-10 h-10 rounded-pill bg-[rgba(29,22,32,0.06)] text-(--ink) transition-[background-color,transform] duration-250 ease-[ease] hover:bg-[#25d366] hover:text-white hover:-translate-y-0.5"
          :href="waLink('Hola, quiero regalar un momento')"
          target="_blank"
          rel="noopener"
          aria-label="Escribir por WhatsApp"
        >
          <PhWhatsappLogo :size="20" weight="fill" />
        </a>
        <a href="#catalogo" class="btn btn-primary py-2.75 px-5.5 text-sm max-[860px]:hidden">Regala un momento</a>
        <button
          class="hidden max-[860px]:inline-flex bg-transparent border-0 text-(--ink) p-1.5"
          type="button"
          @click="menuOpen = !menuOpen"
          aria-label="Abrir menú"
        >
          <PhList v-if="!menuOpen" :size="24" />
          <PhX v-else :size="24" />
        </button>
      </div>
    </div>

    <Transition name="menu-fade">
      <nav
        v-if="menuOpen"
        class="hidden max-[860px]:flex flex-col gap-1 pt-3 px-[clamp(20px,5vw,48px)] pb-6 bg-(--bg) border-t border-(--line)"
        aria-label="Menú móvil"
      >
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="py-3 px-0 font-semibold border-b border-(--line)"
          @click="closeMenu"
        >{{ link.label }}</a>
        <a href="#catalogo" class="btn btn-primary mt-3 w-full" @click="closeMenu">Regala un momento</a>
      </nav>
    </Transition>
  </header>
</template>

<style scoped>
/* Vue <Transition name="menu-fade"> toggles these class names itself during
   enter/leave — not expressible as static utility classes on the element. */
.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 0.2s ease;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
}
</style>
