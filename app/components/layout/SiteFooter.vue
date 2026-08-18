<script setup lang="ts">
import { PhWhatsappLogo, PhInstagramLogo, PhFacebookLogo, PhTiktokLogo, PhEnvelopeSimple, PhMapPin } from '@phosphor-icons/vue'
import { SITE, waLink } from '~/data/site'

const year = new Date().getFullYear()

const columns = [
  {
    title: 'Regalar',
    links: [
      { label: 'Desayunos Sorpresa', href: '#catalogo' },
      { label: 'Regalos Románticos', href: '#catalogo' },
      { label: 'Cumpleaños', href: '#catalogo' },
      { label: 'Kits Especiales', href: '#catalogo' },
    ],
  },
  {
    title: 'Regalando Momentos',
    links: [
      { label: 'Cómo funciona', href: '#como-funciona' },
      { label: 'Historias', href: '#historias' },
      { label: 'Entregas recurrentes', href: '#suscripcion' },
    ],
  },
  {
    title: 'Políticas',
    links: [
      { label: 'Términos y condiciones', href: '#' },
      { label: 'Política de privacidad', href: '#' },
      { label: 'Política de envíos', href: '#' },
      { label: 'Cambios y cancelaciones', href: '#' },
    ],
  },
]
</script>

<template>
  <footer class="bg-(--surface) border-t border-(--line) pt-[clamp(48px,7vw,80px)]">
    <div class="container grid grid-cols-[1.6fr_1fr_1fr_1fr] gap-10 pb-12 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
      <div>
        <a href="#top" class="inline-block font-display font-extrabold text-xl mb-3.5">Regalando Momentos</a>
        <p class="text-(--ink-soft) text-sm leading-relaxed max-w-[32ch] mb-5">Regalos y desayunos sorpresa con entrega a domicilio. Momentos que se sienten, no solo se envían.</p>
        <div class="flex gap-2.5">
          <a
            :href="waLink('Hola, quiero regalar un momento')"
            target="_blank"
            rel="noopener"
            aria-label="WhatsApp"
            class="w-9.5 h-9.5 rounded-full bg-(--bg-alt) inline-flex items-center justify-center text-(--ink) transition-colors duration-250 ease-[ease] hover:bg-(--accent) hover:text-(--on-accent)"
          ><PhWhatsappLogo :size="18" weight="fill" /></a>
          <a
            :href="SITE.instagram"
            target="_blank"
            rel="noopener"
            aria-label="Instagram"
            class="w-9.5 h-9.5 rounded-full bg-(--bg-alt) inline-flex items-center justify-center text-(--ink) transition-colors duration-250 ease-[ease] hover:bg-(--accent) hover:text-(--on-accent)"
          ><PhInstagramLogo :size="18" weight="fill" /></a>
          <a
            :href="SITE.facebook"
            target="_blank"
            rel="noopener"
            aria-label="Facebook"
            class="w-9.5 h-9.5 rounded-full bg-(--bg-alt) inline-flex items-center justify-center text-(--ink) transition-colors duration-250 ease-[ease] hover:bg-(--accent) hover:text-(--on-accent)"
          ><PhFacebookLogo :size="18" weight="fill" /></a>
          <a
            :href="SITE.tiktok"
            target="_blank"
            rel="noopener"
            aria-label="TikTok"
            class="w-9.5 h-9.5 rounded-full bg-(--bg-alt) inline-flex items-center justify-center text-(--ink) transition-colors duration-250 ease-[ease] hover:bg-(--accent) hover:text-(--on-accent)"
          ><PhTiktokLogo :size="18" weight="fill" /></a>
        </div>
      </div>

      <nav v-for="col in columns" :key="col.title" class="flex flex-col gap-3" :aria-label="col.title">
        <h3 class="text-[13px] font-bold uppercase tracking-wider text-(--ink-faint) mb-1">{{ col.title }}</h3>
        <a
          v-for="link in col.links"
          :key="link.label"
          :href="link.href"
          class="text-sm text-(--ink-soft) inline-flex items-center gap-2 transition-colors duration-250 ease-[ease] hover:text-(--accent)"
        >{{ link.label }}</a>
      </nav>

      <div class="flex flex-col gap-3">
        <h3 class="text-[13px] font-bold uppercase tracking-wider text-(--ink-faint) mb-1">Contacto</h3>
        <a
          :href="`mailto:${SITE.email}`"
          class="text-sm text-(--ink-soft) inline-flex items-center gap-2 transition-colors duration-250 ease-[ease] hover:text-(--accent)"
        ><PhEnvelopeSimple :size="16" />{{ SITE.email }}</a>
        <a
          :href="waLink('Hola, quiero regalar un momento')"
          target="_blank"
          rel="noopener"
          class="text-sm text-(--ink-soft) inline-flex items-center gap-2 transition-colors duration-250 ease-[ease] hover:text-(--accent)"
        ><PhWhatsappLogo :size="16" />{{ SITE.phoneDisplay }}</a>
        <span class="text-sm text-(--ink-soft) inline-flex items-center gap-2"><PhMapPin :size="16" />{{ SITE.city }}</span>
      </div>
    </div>

    <div class="container flex justify-between flex-wrap gap-2 py-5.5 border-t border-(--line) text-[13px] text-(--ink-faint)">
      <p>© {{ year }} Regalando Momentos. Todos los derechos reservados.</p>
      <p>Hecho con cariño para quienes no dejan pasar un buen motivo para regalar.</p>
    </div>
  </footer>
</template>
