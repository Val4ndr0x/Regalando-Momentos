<script setup lang="ts">
import { PhHeart, PhSealCheck, PhShieldCheck, PhTruck } from '@phosphor-icons/vue'
import gsap from 'gsap'
import logoIcon from '~/assets/iconos/icon.png'

const BRAND = 'Regalando Momentos'

const trustBadges = [
  { icon: PhShieldCheck, label: 'Compra 100% segura' },
  { icon: PhSealCheck, label: 'Calidad premium garantizada' },
  { icon: PhTruck, label: 'Entrega puntual y confiable' },
]

const showSplash = ref(false)
const showSkipHint = ref(false)
const rootEl = ref<HTMLElement | null>(null)
const boxEl = ref<HTMLElement | null>(null)
const confettiWrapEl = ref<HTMLElement | null>(null)

// Progreso de la barra de carga: objeto plano (no un ref) porque GSAP anima
// su propiedad `value` directamente vía tween; el template lee `progress.value`.
const progress = reactive({ value: 0 })

const [firstWord, secondWord] = BRAND.split(' ')
const firstLineLetters = firstWord!.slice(1)
  .split('')
  .map((char, i) => ({ char, i }))
const secondLineLetters = secondWord!.split('').map((char, i) => ({ char, i }))

const SEEN_KEY = 'rm-splash-seen'

// Piezas de confeti/destellos generadas una sola vez (posiciones/colores random
// fijados en setup para que no cambien entre renders del mismo montaje).
// Pocas piezas, grandes: se lee mejor "estudio" que una lluvia de confeti plano.
const CONFETTI_COLORS = ['#c1275a', '#98123f', '#e8c565', '#a67c22', '#7c1030', '#e34d76']
const confettiPieces = Array.from({ length: 16 }, (_, i) => {
  const angle = (Math.PI * 2 * i) / 16 + Math.random() * 0.4
  const distance = 100 + Math.random() * 160
  return {
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance - 40,
    rotate: (Math.random() - 0.5) * 720,
    size: 9 + Math.random() * 11,
    shape: i % 3 === 0 ? '50%' : '2px',
    delay: Math.random() * 0.12,
  }
})
const sparkPieces = Array.from({ length: 14 }, (_, i) => {
  const angle = (Math.PI * 2 * i) / 14 + Math.random() * 0.5
  const distance = 60 + Math.random() * 120
  return {
    id: i,
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance - 20,
    size: 4 + Math.random() * 6,
    delay: Math.random() * 0.1,
  }
})

// Globos que salen disparados del regalo al reventar, mismo gráfico que usa
// el Hero para la categoría "Regalos Románticos" (congruencia visual).
const balloonPieces = Array.from({ length: 5 }, (_, i) => {
  const spread = (i - (5 - 1) / 2) / (5 - 1) // -0.5..0.5, reparte los globos en abanico
  return {
    id: i,
    x: spread * 260 + (Math.random() - 0.5) * 40,
    y: -420 - Math.random() * 140,
    rotate: spread * 30 + (Math.random() - 0.5) * 14,
    size: 100 + Math.random() * 50,
    delay: Math.random() * 0.15,
  }
})

let ctx: gsap.Context | null = null
let timeline: gsap.core.Timeline | null = null

function skip() {
  timeline?.progress(1)
}

onMounted(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion) return

  // TODO: reactivar el guard de "una vez por sesión" (sessionStorage[SEEN_KEY])
  // cuando terminemos de ajustar el diseño — desactivado temporalmente para
  // poder ver la animación en cada recarga mientras se itera.

  showSplash.value = true
  document.documentElement.style.overflow = 'hidden'

  nextTick(() => {
    if (!rootEl.value || !boxEl.value) return
    setTimeout(() => {
      showSkipHint.value = true
    }, 900)

    ctx = gsap.context(() => {
      const tl = gsap.timeline()
      timeline = tl

      // 1) INTRO: entra con bounce elástico y rebota 2 veces con squash & stretch.
      tl.from(boxEl.value, { y: -260, opacity: 0, duration: 0.45, ease: 'power2.in' })
        .to(boxEl.value, { y: 0, duration: 0.42, ease: 'power1.out' }, '>-0.05')
        .to(boxEl.value, { scaleX: 1.22, scaleY: 0.72, duration: 0.1, ease: 'power1.out' }, '<')
        .to(boxEl.value, { scaleX: 0.92, scaleY: 1.1, duration: 0.14, ease: 'power2.out' })
        .to(boxEl.value, { scaleX: 1, scaleY: 1, y: -70, duration: 0.24, ease: 'power2.out' })
        .to(boxEl.value, { y: 0, duration: 0.22, ease: 'power1.out' })
        .to(boxEl.value, { scaleX: 1.14, scaleY: 0.82, duration: 0.09, ease: 'power1.out' }, '<')
        .to(boxEl.value, { scaleX: 0.96, scaleY: 1.05, duration: 0.12, ease: 'power2.out' })
        .to(boxEl.value, { scaleX: 1, scaleY: 1, y: -26, duration: 0.16, ease: 'power2.out' })
        .to(boxEl.value, { y: 0, duration: 0.16, ease: 'bounce.out' })
        .to('.gift-shadow', { scale: 1, opacity: 0.35, duration: 0.16 }, '<')

      // 2) ANTICIPACIÓN TIPO RANA: se infla y desinfla conteniéndose, 3 veces,
      // cada vez más grande, temblando cuando está a punto de reventar.
      const inflate = (scale: number, wobble: number, dur: number) =>
        gsap
          .timeline()
          .to(boxEl.value, { scaleX: scale, scaleY: scale * 0.94, duration: dur, ease: 'power2.out' })
          .to(boxEl.value, { x: -wobble, duration: 0.03, ease: 'power1.inOut' })
          .to(boxEl.value, { x: wobble, duration: 0.05, ease: 'power1.inOut' }, '<0.03')
          .to(boxEl.value, { x: -wobble * 0.7, duration: 0.05, ease: 'power1.inOut' })
          .to(boxEl.value, { x: 0, duration: 0.05, ease: 'power1.inOut' })
          .to(boxEl.value, { scaleX: 1, scaleY: 1, duration: dur * 0.7, ease: 'power2.in' }, '-=0.05')

      tl.add(inflate(1.08, 2, 0.22))
        .add(inflate(1.16, 4, 0.2))
        .add(inflate(1.28, 7, 0.18))
        .to(boxEl.value, { scale: 1.05, duration: 0.06, ease: 'power4.in' })

      // 3) EXPLOSIÓN: estalla de golpe en confeti, papel y destellos dorados
      // en cámara lenta, y del centro nace el texto de marca.
      tl.set(boxEl.value, { opacity: 0 }, '>')
        .set(confettiWrapEl.value, { opacity: 1 }, '<')
        .fromTo(
          '.confetti-piece',
          { x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.4 },
          {
            x: (i: number) => confettiPieces[i]!.x,
            y: (i: number) => confettiPieces[i]!.y + 160,
            rotate: (i: number) => confettiPieces[i]!.rotate,
            scale: 1,
            opacity: 0,
            duration: 1.5,
            ease: 'power2.out',
            stagger: { each: 0.01, from: 'random' },
          },
          '<'
        )
        .fromTo(
          '.spark-piece',
          { x: 0, y: 0, opacity: 1, scale: 0.2 },
          {
            x: (i: number) => sparkPieces[i]!.x,
            y: (i: number) => sparkPieces[i]!.y,
            scale: 1.4,
            opacity: 0,
            duration: 1.1,
            ease: 'power3.out',
            stagger: { each: 0.008, from: 'random' },
          },
          '<'
        )
        .fromTo(
          '.flash-burst',
          { scale: 0, opacity: 0.85 },
          { scale: 2.1, opacity: 0, duration: 0.4, ease: 'power2.out' },
          '<'
        )
        // Globos que escapan de la caja flotando hacia arriba, un instante
        // después del estallido inicial de confeti/destellos.
        .fromTo(
          '.balloon-piece',
          { x: 0, y: 40, opacity: 0, scale: 0.3, rotate: 0 },
          {
            x: (i: number) => balloonPieces[i]!.x,
            y: (i: number) => balloonPieces[i]!.y,
            rotate: (i: number) => balloonPieces[i]!.rotate,
            opacity: 1,
            scale: 1,
            duration: 1.5,
            ease: 'power2.out',
            stagger: { each: 0.05, from: 'random' },
          },
          '-=1.1'
        )
        .to(
          '.balloon-piece',
          { opacity: 0, duration: 0.5, ease: 'power1.in' },
          '-=0.35'
        )

      // 4) TARJETA: la marca aparece con letras elásticas (logo en el lugar
      // de la "R"), y justo detrás se revela la tarjeta de carga completa
      // (tagline, barra de progreso, categorías y sellos de confianza).
      tl.set('.splash-card', { display: 'flex' }, '-=1')
        .fromTo(
          '.splash-card',
          { opacity: 0, y: 26, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' },
          '-=1'
        )
        .fromTo(
          ['.splash__logo', '.splash__letter'],
          { opacity: 0, scale: 0, y: 18, rotate: () => gsap.utils.random(-25, 25) },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            rotate: 0,
            duration: 0.7,
            stagger: 0.03,
            ease: 'elastic.out(1, 0.55)',
          },
          '-=0.5'
        )
        .fromTo(
          '.splash-reveal',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.09, ease: 'power2.out' },
          '-=0.35'
        )
        .to(
          progress,
          {
            value: 100,
            duration: 1.7,
            ease: 'power1.inOut',
          },
          '-=0.15'
        )
        .to({}, { duration: 0.5 }) // pausa para leer la tarjeta al 100%
        .to(rootEl.value, { opacity: 0, duration: 0.4, ease: 'power2.in' })
        .call(() => {
          document.documentElement.style.overflow = ''
          showSplash.value = false
          showSkipHint.value = false
          ctx?.revert()
          ctx = null
          timeline = null
        })
    }, rootEl.value)
  })
})

onBeforeUnmount(() => {
  ctx?.revert()
  document.documentElement.style.overflow = ''
})
</script>

<template>
  <div
    v-if="showSplash"
    ref="rootEl"
    class="rm-splash fixed inset-0 z-200 flex items-center justify-center cursor-pointer"
    role="status"
    aria-live="polite"
    aria-label="Cargando Regalando Momentos"
    @click="skip"
  >
    <div class="relative flex flex-col items-center justify-center" style="perspective: 1200px">
      <!-- Foco de luz cálido detrás del regalo, tipo estudio -->
      <div class="stage-glow absolute left-1/2 top-1/2 w-[130vmin] h-[130vmin] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none" />

      <!-- Sombra de contacto en el suelo -->
      <div class="gift-shadow absolute left-1/2 bottom-[10%] w-40 h-8 rounded-[50%] bg-black/50 blur-md scale-75 opacity-0" style="translate: -50% 0" />

      <!-- Caja de regalo: el mismo gráfico usado en el Hero (categoría
           "Regalos Románticos"), grande, centrada, apoyada sobre su sombra. -->
      <div ref="boxEl" class="gift-box relative w-[62vmin] h-[62vmin] will-change-transform" style="transform-style: preserve-3d">
        <img
          src="/regalos/caja.png"
          alt=""
          class="w-full h-full object-contain drop-shadow-[0_28px_50px_rgba(0,0,0,0.55)]"
        />
      </div>

      <!-- Destello de explosión: tono acento, no blanco puro, para que no lave
           el confeti/globos que salen justo detrás. -->
      <div class="flash-burst absolute left-1/2 top-1/2 w-[36vmin] h-[36vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(232,197,101,0.85),rgba(193,39,90,0.55)_45%,transparent_72%)] opacity-0 pointer-events-none" />

      <!-- Confeti y destellos -->
      <div ref="confettiWrapEl" class="pointer-events-none absolute inset-0 opacity-0">
        <span
          v-for="p in confettiPieces"
          :key="'c' + p.id"
          class="confetti-piece absolute left-1/2 top-1/2 will-change-transform"
          :style="{
            width: p.size + 'px',
            height: p.size * 0.6 + 'px',
            marginLeft: -(p.size / 2) + 'px',
            marginTop: -(p.size * 0.3) + 'px',
            backgroundColor: p.color,
            borderRadius: p.shape,
            boxShadow: '0 2px 5px rgba(29,22,32,0.22)',
          }"
        />
        <span
          v-for="s in sparkPieces"
          :key="'s' + s.id"
          class="spark-piece absolute left-1/2 top-1/2 rounded-full will-change-transform"
          :style="{
            width: s.size + 'px',
            height: s.size + 'px',
            marginLeft: -(s.size / 2) + 'px',
            marginTop: -(s.size / 2) + 'px',
            background: 'radial-gradient(circle, #fff0f3, var(--accent))',
            boxShadow: '0 0 6px 1px rgba(193,39,90,0.55)',
          }"
        />
        <img
          v-for="b in balloonPieces"
          :key="'b' + b.id"
          src="/regalos/globo.png"
          alt=""
          class="balloon-piece absolute left-1/2 top-1/2 opacity-0 will-change-transform"
          :style="{
            width: b.size + 'px',
            marginLeft: -(b.size / 2) + 'px',
            marginTop: -(b.size / 2) + 'px',
          }"
        />
      </div>
    </div>
    <!-- Fuera del contenedor con `perspective` de arriba a propósito: ese
         `perspective` crea containing block para todo lo `fixed` dentro de
         él, así que una tarjeta/skip-hint anidados ahí quedarían encerrados
         en el tamaño de la caja de regalo (vmin) en vez de ocupar la
         pantalla completa. -->

    <!-- Tarjeta de carga: aparece cuando el regalo revienta. Lleva la
         marca, la promesa, el progreso de carga y un adelanto de las
         categorías, para que la espera se sienta parte de la experiencia
         en vez de una pantalla vacía. Oculta por defecto (GSAP la revela
         con display:flex al llegar a este punto del timeline). -->
    <div class="fixed inset-0 flex items-center justify-center p-6 pointer-events-none">
        <div class="splash-card splash-card--surface hidden relative w-full max-w-[1180px] flex-col items-center gap-8 rounded-[28px] border border-(--line) px-6 py-10 sm:px-12 sm:py-14 shadow-[0_50px_100px_-30px_rgba(29,22,32,0.35)] backdrop-blur-sm opacity-0">
          <!-- Cintas doradas decorativas, se salen del borde de la tarjeta -->
          <svg class="ribbon ribbon--left" viewBox="0 0 220 260" fill="none" aria-hidden="true">
            <path d="M-10 250C40 200 30 150 80 130C130 110 110 60 160 20" stroke="url(#ribbonGoldL)" stroke-width="7" stroke-linecap="round" />
            <circle cx="80" cy="130" r="4" fill="#e8c565" />
            <circle cx="160" cy="20" r="3" fill="#f3d27e" />
            <circle cx="30" cy="150" r="2.5" fill="#e8c565" />
            <defs>
              <linearGradient id="ribbonGoldL" x1="0" y1="260" x2="220" y2="0">
                <stop offset="0" stop-color="#a67c22" />
                <stop offset="1" stop-color="#f3d27e" />
              </linearGradient>
            </defs>
          </svg>
          <svg class="ribbon ribbon--right" viewBox="0 0 220 260" fill="none" aria-hidden="true">
            <path d="M230 10C180 60 190 110 140 130C90 150 110 200 60 240" stroke="url(#ribbonGoldR)" stroke-width="7" stroke-linecap="round" />
            <circle cx="140" cy="130" r="4" fill="#e8c565" />
            <circle cx="60" cy="240" r="3" fill="#f3d27e" />
            <circle cx="190" cy="110" r="2.5" fill="#e8c565" />
            <defs>
              <linearGradient id="ribbonGoldR" x1="220" y1="0" x2="0" y2="260">
                <stop offset="0" stop-color="#a67c22" />
                <stop offset="1" stop-color="#f3d27e" />
              </linearGradient>
            </defs>
          </svg>

          <!-- Marca: el logo hace de primera letra de "Regalando", con
               "Momentos" debajo en el dorado del isotipo. -->
          <p
            class="splash__brand relative tracking-tight text-(--ink) [text-shadow:0_1px_0_rgba(255,255,255,0.5),0_10px_26px_rgba(29,22,32,0.18),0_0_24px_rgba(193,39,90,0.18)] flex flex-col items-center justify-center"
            aria-label="Regalando Momentos"
          >
            <span class="relative flex flex-nowrap items-center justify-center whitespace-nowrap pl-[3.1em]">
              <!-- Wrapper estático solo para centrar verticalmente: GSAP anima
                   el <img> (opacity/scale/rotate/y) y esos tweens sobrescriben
                   el transform completo, así que el centrado no puede vivir
                   en un translate del mismo elemento o se pierde al terminar. -->
              <span class="absolute left-0 inset-y-0 flex items-center pointer-events-none">
                <img
                  :src="logoIcon"
                  alt=""
                  class="splash__logo w-[4em] h-[4em] object-contain opacity-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                />
              </span>
              <span
                v-for="letter in firstLineLetters"
                :key="'w1-' + letter.i"
                class="splash__letter inline-block opacity-0 will-change-transform"
              >{{ letter.char }}</span>
            </span>
            <span class="splash__momentos flex flex-nowrap items-center justify-center whitespace-nowrap">
              <span
                v-for="letter in secondLineLetters"
                :key="'w2-' + letter.i"
                class="splash__letter splash__letter--gold inline-block opacity-0 will-change-transform"
              >{{ letter.char }}</span>
            </span>
          </p>

          <!-- Corazón: remate del wordmark, mismo trazo dorado -->
          <PhHeart class="splash-reveal opacity-0" :size="30" weight="light" style="color: #a67c22" />

          <!-- Promesa de marca -->
          <p class="splash-reveal opacity-0 max-w-lg text-center text-sm sm:text-base text-(--ink-soft)">
            Creamos detalles que se sienten,
            <span class="font-semibold" style="color: #a67c22; margin-right: 0.28em">se recuerdan</span>y se comparten.
          </p>

          <!-- Barra de progreso -->
          <div class="splash-reveal opacity-0 w-full max-w-md flex flex-col items-center gap-2">
            <div class="h-1.5 w-full overflow-hidden rounded-full bg-(--ink)/10">
              <div class="h-full rounded-full progress-fill" :style="{ width: progress.value + '%' }" />
            </div>
            <p class="text-xs text-(--ink-faint)">
              Cargando momentos especiales… {{ Math.round(progress.value) }}%
            </p>
          </div>

          <!-- Sellos de confianza -->
          <div class="splash-reveal opacity-0 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <div
              v-for="badge in trustBadges"
              :key="badge.label"
              class="flex items-center gap-1.5 text-xs text-(--ink-soft)"
            >
              <component :is="badge.icon" :size="16" weight="regular" style="color: #a67c22" />
              {{ badge.label }}
            </div>
          </div>
        </div>
      </div>

      <!-- Pista de "toca para saltar": fixed al viewport (no al wrapper de la
           caja de regalo, cuya altura ya no representa el alto real de la
           tarjeta) para que siempre quede al pie de la pantalla. -->
      <span
        class="skip-hint fixed bottom-5 left-1/2 -translate-x-1/2 text-xs tracking-wide text-(--ink-soft) transition-opacity duration-500"
        :class="showSkipHint ? 'opacity-100' : 'opacity-0'"
      >Toca para omitir</span>
  </div>
</template>

<style scoped>
/* Misma paleta de marca que el resto del sitio (main.css: --bg, --ink,
   --accent...), para que el splash se sienta parte del mismo producto y no
   una ventana de intro aparte. */
.rm-splash {
  background: linear-gradient(160deg, var(--bg) 0%, var(--accent-tint) 55%, var(--accent-tint-strong) 100%);
}

/* Tipografía moderna, propia de esta ventana de intro (no font-display del
   resto del sitio, que aquí se veía plana): geométrica, extra bold, con
   tracking ligeramente negativo para lectura tipo "wordmark". */
.splash__brand {
  font-family: 'Plus Jakarta Sans', 'Sora', 'Segoe UI', sans-serif;
  font-weight: 800;
  font-size: clamp(1.6rem, 7.2vw, 3.25rem);
  letter-spacing: -0.02em;
  line-height: 1.1;
  gap: 0.08em;
}

/* "Momentos" en el mismo dorado del isotipo (icon.png), un punto más grande
   y con más aire respecto a "Regalando" para que se lea como el cierre de
   la marca, no como una segunda línea del mismo peso. */
.splash__momentos {
  margin-top: 0.06em;
  font-size: 1.16em;
  letter-spacing: -0.01em;
}

/* Mismo dorado del isotipo, pero llevado a tonos más profundos (sin los
   crema casi blancos del logo) para que no se funda con el fondo rosa
   claro del splash; el contorno oscuro replica el trazo del isotipo y es
   lo que realmente le da lectura sobre cualquier fondo. */
.splash__letter--gold {
  background: linear-gradient(180deg, #f3d27e 0%, #d9a635 45%, #8a6013 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  -webkit-text-stroke: 1.5px rgba(29, 22, 32, 0.55);
  paint-order: stroke fill;
  text-shadow: 0 3px 0 rgba(120, 82, 12, 0.4), 0 10px 20px rgba(29, 22, 32, 0.25);
}

.stage-glow {
  background: radial-gradient(circle, rgba(193, 39, 90, 0.16) 0%, rgba(193, 39, 90, 0.06) 42%, transparent 72%);
  filter: blur(2px);
}

/* Cintas doradas decorativas: se salen del borde de la tarjeta hacia las
   esquinas, como remate "premium" (mismo dorado del isotipo/wordmark). */
.ribbon {
  position: absolute;
  top: -70px;
  width: 150px;
  height: 210px;
  opacity: 0.6;
  pointer-events: none;
  filter: drop-shadow(0 6px 14px rgba(166, 124, 34, 0.25));
}

.ribbon--left {
  left: -50px;
}

.ribbon--right {
  right: -50px;
  transform: scaleX(-1);
}

/* La tarjeta usaba --surface casi blanco puro, que sobre el fondo rosa
   degradado del splash se veía como un recuadro plano y duro (mucho salto
   de contraste). Se mezcla con un toque del rosa de marca para que quede
   integrada, no pegada encima. */
.splash-card--surface {
  background: linear-gradient(180deg, color-mix(in srgb, var(--surface) 92%, var(--accent-tint)) 0%, color-mix(in srgb, var(--surface) 80%, var(--accent-tint)) 100%);
}

.progress-fill {
  background: linear-gradient(90deg, #a67c22, #e8c565 55%, #f3d27e);
}

/* Sombra propia para que los globos se despeguen del fondo claro en vez de
   fundirse con el rosa del splash. */
.balloon-piece {
  filter: drop-shadow(0 10px 16px rgba(29, 22, 32, 0.28));
}

</style>
