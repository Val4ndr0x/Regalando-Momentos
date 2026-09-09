import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/fonts'],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  components: [{ path: '~/components', pathPrefix: false }],
  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      title: 'Desayunos Sorpresa a Domicilio Hoy | Regalando Momentos',
      meta: [
        {
          name: 'description',
          content:
            'Sorprende con desayunos sorpresa, flores y regalos personalizados, con entrega a domicilio el mismo día. ¡Haz de hoy un momento inolvidable! Pide ya.',
        },
        { name: 'theme-color', content: '#FDF5F7' },
      ],
    },
  },
  fonts: {
    families: [
      { name: 'Sora', provider: 'google', weights: [500, 600, 700, 800] },
      { name: 'Plus Jakarta Sans', provider: 'google', weights: [400, 500, 600, 700, 800] },
    ],
  },
})
