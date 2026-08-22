<script setup lang="ts">
const featured = {
  tag: 'Aeropuerto CDMX',
  title: 'La bandeja que llegó tres minutos antes del vuelo',
  excerpt:
    'Nos escribió a las 6:40am: su esposo salía a las 8 y quería que desayunara algo especial antes de irse un mes. Llegamos a las 7:20, tocamos la puerta y el café todavía humeaba.',
  image: 'https://picsum.photos/seed/regalando-momentos-amanecer/900/700',
}

const stories = [
  {
    tag: 'Guadalajara',
    title: 'Flores para una disculpa que valía la pena',
    excerpt: 'Escribió la nota tres veces antes de quedar conforme. Nosotros solo entregamos las flores.',
    image: 'https://picsum.photos/seed/regalando-momentos-flores/500/400',
  },
  {
    tag: 'Monterrey',
    title: 'El cumpleaños que armamos en cuarenta minutos',
    excerpt: 'Llamó a las 5, la fiesta era a las 6. Los globos llegaron inflados y la caja, cerrada con moño.',
    image: 'https://picsum.photos/seed/regalando-momentos-fiesta/500/400',
  },
  {
    tag: 'Puebla',
    title: 'Una bandeja dulce para la amiga que nunca pide nada',
    excerpt: 'A veces el regalo más difícil es para quien siempre cuida a los demás primero.',
    image: 'https://picsum.photos/seed/regalando-momentos-spa/500/400',
  },
]
</script>

<template>
  <section id="historias" class="container py-[clamp(64px,10vw,120px)]">
    <div class="max-w-[52ch] mb-10" v-reveal>
      <h2 class="text-[clamp(1.9rem,3.4vw,2.7rem)] mb-3.5">Historias reales de entregas</h2>
      <p class="text-(--ink-soft) text-[17px]">Detrás de cada pedido hay alguien pensando en alguien más. Estas son algunas de esas veces.</p>
    </div>

    <div class="grid grid-cols-[1.2fr_1fr] gap-7 items-start max-[900px]:grid-cols-1">
      <article class="bg-(--surface) rounded-card border border-(--line) overflow-hidden" v-reveal>
        <img
          :src="featured.image"
          :alt="featured.title"
          width="900"
          height="700"
          loading="lazy"
          decoding="async"
          class="w-full aspect-[4/3] object-cover"
        />
        <div class="p-7">
          <span class="text-xs font-bold uppercase tracking-wider text-(--accent)">{{ featured.tag }}</span>
          <h3 class="text-[1.4rem] mt-2.5 mx-0 mb-3">{{ featured.title }}</h3>
          <p class="text-(--ink-soft) leading-[1.6]">{{ featured.excerpt }}</p>
        </div>
      </article>

      <div class="flex flex-col gap-5">
        <article
          v-for="(s, i) in stories"
          :key="s.title"
          class="grid grid-cols-[110px_1fr] gap-4 max-[480px]:grid-cols-[84px_1fr]"
          v-reveal="i + 1"
        >
          <img
            :src="s.image"
            :alt="s.title"
            width="500"
            height="400"
            loading="lazy"
            decoding="async"
            class="w-[110px] h-[90px] object-cover rounded-[14px] max-[480px]:w-[84px] max-[480px]:h-[72px]"
          />
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-(--accent)">{{ s.tag }}</span>
            <h4 class="text-base my-1.5 font-display">{{ s.title }}</h4>
            <p class="text-[13.5px] text-(--ink-soft) leading-normal">{{ s.excerpt }}</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
