<script setup lang="ts">
import { PhEnvelopeSimple } from '@phosphor-icons/vue'
import logoWithCircle from '~/assets/iconos/logowithcircle.png'

const year = new Date().getFullYear()
const email = ref('')

const columns = [
  {
    title: '',
    links: [
      { label: 'Inicio', href: '#top' },
      { label: 'Colecciones', href: '#catalogo' },
      { label: 'Detalles para ella', href: '#catalogo' },
      { label: 'Detalles para él', href: '#catalogo' },
      { label: 'Momentos especiales', href: '#catalogo' },
      { label: 'Eventos & celebraciones', href: '#catalogo' },
    ],
  },
  {
    title: '',
    links: [
      { label: 'Sobre nosotros', href: '#como-funciona' },
      { label: 'Cómo comprar', href: '#como-funciona' },
      { label: 'Envíos y entregas', href: '#' },
      { label: 'Personalización', href: '#' },
    ],
  },
]

function subscribe() {
  email.value = ''
}
</script>

<template>
  <footer class="footer-dark pt-[clamp(48px,7vw,80px)]">
    <div class="container grid grid-cols-[1.4fr_1fr_1fr] gap-10 pb-12 max-[900px]:grid-cols-1">
      <div>
        <a href="#top" class="inline-block mb-6">
          <img :src="logoWithCircle" alt="Regalando Momentos" class="w-24 h-24 object-contain">
        </a>

        <h3 class="footer-gold font-display font-bold text-xl mb-3">Recibe detalles con amor</h3>
        <p class="text-white/60 text-sm leading-relaxed max-w-[38ch] mb-5">
          Ideas de regalo, promociones exclusivas y sorpresas nuevas cada mes. Directo a tu correo.
        </p>

        <form class="flex flex-col gap-3 max-w-md" @submit.prevent="subscribe">
          <label class="relative block">
            <span class="sr-only">Tu correo electrónico</span>
            <PhEnvelopeSimple :size="18" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              v-model="email"
              type="email"
              required
              placeholder="Tu correo electrónico"
              class="w-full rounded-xl border border-white/15 bg-white/5 py-3 pl-10 pr-3.5 text-sm text-white placeholder:text-white/40 outline-none transition-colors duration-250 ease-[ease] focus:border-(--footer-gold)"
            >
          </label>
          <button
            type="submit"
            class="rounded-xl bg-(--footer-gold) py-3 text-sm font-semibold text-[#1d1620] transition-colors duration-250 ease-[ease] hover:bg-(--footer-gold-dark)"
          >Quiero sorprender</button>
        </form>
      </div>

      <nav v-for="(col, i) in columns" :key="i" class="flex flex-col gap-3 pt-2 max-[900px]:pt-0">
        <a
          v-for="link in col.links"
          :key="link.label"
          :href="link.href"
          class="text-sm text-white/70 transition-colors duration-250 ease-[ease] hover:text-(--footer-gold)"
        >{{ link.label }}</a>
      </nav>
    </div>

    <div class="border-t border-white/10">
      <div class="container flex justify-between flex-wrap gap-2 py-5.5 text-[13px] text-white/50">
        <p>© {{ year }} Regalando Momentos. Hecho con amor 🧡<br class="max-[560px]:hidden">
          para crear recuerdos inolvidables</p>
        <p class="flex flex-wrap gap-x-6 gap-y-1 items-start">
          <a href="#" class="transition-colors duration-250 ease-[ease] hover:text-(--footer-gold)">Términos y condiciones</a>
          <a href="#" class="transition-colors duration-250 ease-[ease] hover:text-(--footer-gold)">Política de privacidad</a>
          <a href="#" class="transition-colors duration-250 ease-[ease] hover:text-(--footer-gold)">Preguntas frecuentes</a>
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Este footer es una sección oscura deliberada (no sigue --bg/--surface
   claros del resto del sitio): imita una tarjeta de presentación de marca,
   con el dorado del isotipo como único acento. */
.footer-dark {
  --footer-gold: #e8c565;
  --footer-gold-dark: #d9a635;
  background: #121016;
  color: #fff;
}

.footer-gold {
  color: var(--footer-gold);
}
</style>
