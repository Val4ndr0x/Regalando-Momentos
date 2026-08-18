<script setup lang="ts">
import { PhWhatsappLogo } from '@phosphor-icons/vue'
import { waLink } from '~/data/site'
</script>

<template>
  <a
    class="fixed right-5.5 bottom-5.5 z-40 w-14 h-14 rounded-full bg-[#25d366] text-white inline-flex items-center justify-center shadow-[0_16px_32px_-12px_rgba(37,211,102,0.55)] transition-transform duration-250 ease-out hover:-translate-y-0.75 hover:scale-[1.04] max-sm:right-4 max-sm:bottom-4 max-sm:w-12.5 max-sm:h-12.5"
    :href="waLink('Hola, quiero regalar un momento')"
    target="_blank"
    rel="noopener"
    aria-label="Escribir por WhatsApp"
  >
    <PhWhatsappLogo :size="26" weight="fill" />
  </a>
</template>
