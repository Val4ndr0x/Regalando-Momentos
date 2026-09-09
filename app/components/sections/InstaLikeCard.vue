<script setup lang="ts">
import { PhChatCircle, PhDotsThreeVertical, PhHeart, PhPaperPlaneTilt } from '@phosphor-icons/vue'
import type { Category } from '~/data/categories'
import { products } from '~/data/products'

const props = defineProps<{
  category: Category
  active: boolean
  clientImage: string
}>()

// Producto "estrella" mostrado en la publicación simulada: el marcado como featured
// para la categoría, o si no hay ninguno, el primero de la lista.
const product = computed(() => {
  const list = products.filter((p) => p.categoryId === props.category.id)
  return list.find((p) => p.featured) ?? list[0]
})

const liked = ref(false)
const likeCount = ref(0)
const showBigHeart = ref(false)

let loopTimer: ReturnType<typeof setTimeout> | null = null
let heartTimer: ReturnType<typeof setTimeout> | null = null
let reduceMotion = false

// Base de "me gusta" por categoría (determinista a partir del id) para que cada
// tarjeta muestre un número creíble sin depender de datos reales de backend.
function baseLikes(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) % 900
  return 180 + hash
}

const LIKE_LOOP_INTERVAL_MS = 3400
const BIG_HEART_DURATION_MS = 900

function clearTimers() {
  if (loopTimer) clearTimeout(loopTimer)
  if (heartTimer) clearTimeout(heartTimer)
  loopTimer = null
  heartTimer = null
}

// Simula el gesto de doble-tap "me encanta" de Instagram: aparece el corazón grande
// sobre la foto, el ícono de like se rellena y el contador sube; luego, tras una
// pausa, vuelve al estado inicial y se repite mientras la tarjeta esté al frente de la pila.
function playLikeCycle() {
  clearTimers()
  if (reduceMotion) {
    liked.value = true
    likeCount.value = baseLikes(props.category.id) + 1
    return
  }

  liked.value = false
  likeCount.value = baseLikes(props.category.id)

  loopTimer = setTimeout(() => {
    liked.value = true
    likeCount.value = baseLikes(props.category.id) + 1
    showBigHeart.value = true
    heartTimer = setTimeout(() => {
      showBigHeart.value = false
    }, BIG_HEART_DURATION_MS)
    loopTimer = setTimeout(playLikeCycle, LIKE_LOOP_INTERVAL_MS)
  }, LIKE_LOOP_INTERVAL_MS * 0.55)
}

function tapLike() {
  liked.value = !liked.value
  likeCount.value = baseLikes(props.category.id) + (liked.value ? 1 : 0)
  if (liked.value) {
    showBigHeart.value = true
    if (heartTimer) clearTimeout(heartTimer)
    heartTimer = setTimeout(() => {
      showBigHeart.value = false
    }, BIG_HEART_DURATION_MS)
  }
}

// El loop de "me gusta" solo corre mientras esta tarjeta está al frente de la pila
// (revelada), para no gastar timers en las que están tapadas detrás.
watch(
  () => props.active,
  (isActive) => {
    if (isActive) playLikeCycle()
    else clearTimers()
  },
  { immediate: true }
)

onMounted(() => {
  reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
})

onBeforeUnmount(clearTimers)
</script>

<template>
  <div
    v-if="product"
    class="insta-like-card w-full h-full flex flex-col rounded-(--radius-card) bg-(--surface) shadow-[0_30px_60px_-20px_rgba(0,0,0,0.4)] ring-1 ring-black/5 overflow-hidden select-none"
  >
    <div class="flex items-center gap-2 px-3.5 py-3">
      <div class="w-8 h-8 shrink-0 rounded-full bg-gradient-to-tr from-(--accent) to-(--accent-dark) flex items-center justify-center text-(--on-accent) text-[11px] font-bold">
        RM
      </div>
      <p class="flex-1 min-w-0 text-[12px] font-semibold text-(--ink) truncate leading-tight">
        regalando.momentos
      </p>
      <PhDotsThreeVertical :size="17" class="text-(--ink-soft) shrink-0" />
    </div>

    <button
      type="button"
      class="relative block w-full flex-1 min-h-0 bg-(--bg-alt) cursor-pointer"
      aria-label="Publicación de ejemplo, doble toque para simular me gusta"
      @click="tapLike"
      @dblclick.prevent
    >
      <img
        :src="clientImage"
        :alt="`Cliente feliz con ${product.name}`"
        class="w-full h-full object-cover pointer-events-none select-none"
        loading="lazy"
        draggable="false"
      />
      <Transition name="insta-like-heart">
        <PhHeart
          v-if="showBigHeart"
          weight="fill"
          :size="92"
          class="absolute inset-0 m-auto text-white drop-shadow-[0_6px_18px_rgba(0,0,0,0.25)]"
        />
      </Transition>
    </button>

    <div class="flex items-center gap-3 px-3.5 pt-3">
      <PhHeart
        :weight="liked ? 'fill' : 'regular'"
        :size="21"
        class="transition-transform duration-200"
        :class="liked ? 'text-(--accent) scale-110' : 'text-(--ink)'"
      />
      <PhChatCircle :size="21" class="text-(--ink)" />
      <PhPaperPlaneTilt :size="21" class="text-(--ink)" />
    </div>

    <p class="px-3.5 pt-2 text-[12px] font-semibold text-(--ink) tabular-nums">
      {{ likeCount.toLocaleString('es-CO') }} Me gusta
    </p>
    <p class="px-3.5 pb-3 pt-0.5 text-[12px] leading-snug text-(--ink-soft) truncate">
      <span class="font-semibold text-(--ink)">regalando.momentos</span> {{ product.name }}
    </p>
  </div>
</template>

<style scoped>
.insta-like-heart-enter-active {
  animation: insta-like-heart-pop 0.9s cubic-bezier(0.16, 1, 0.3, 1);
}

.insta-like-heart-leave-active {
  transition: opacity 0.25s ease-out;
}

.insta-like-heart-leave-to {
  opacity: 0;
}

@keyframes insta-like-heart-pop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  15% {
    transform: scale(1.15);
    opacity: 1;
  }
  30% {
    transform: scale(0.95);
  }
  45% {
    transform: scale(1.05);
  }
  60% {
    transform: scale(1);
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .insta-like-heart-enter-active {
    animation: none;
  }
}
</style>
