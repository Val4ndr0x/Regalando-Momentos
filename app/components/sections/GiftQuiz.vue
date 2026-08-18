<script setup lang="ts">
import { PhArrowLeft, PhArrowRight } from '@phosphor-icons/vue'
import { categories } from '~/data/categories'
import GiftArt from '~/components/art/GiftArt.vue'

const options = [
  { label: 'Para alguien que amas', categoryId: 'romanticos' },
  { label: 'Para celebrar un cumpleaños', categoryId: 'cumpleanos' },
  { label: 'Para despertarlo con algo rico', categoryId: 'desayunos' },
  { label: 'Para quien es difícil de sorprender', categoryId: 'kits' },
]

const selectedCategory = useSelectedCategory()
const resultId = ref<string | null>(null)

const result = computed(() => categories.find((c) => c.id === resultId.value) ?? null)

function pick(categoryId: string) {
  resultId.value = categoryId
}

function goToCatalog() {
  if (resultId.value) selectedCategory.value = resultId.value
}

function reset() {
  resultId.value = null
}
</script>

<template>
  <section class="py-[clamp(64px,10vw,120px)]">
    <div class="container flex justify-center">
      <div class="w-full max-w-[720px] bg-(--surface) border border-(--line) rounded-[28px] p-[clamp(32px,6vw,56px)] shadow-(--shadow-soft)" v-reveal>
        <Transition name="quiz-fade" mode="out-in">
          <div v-if="!result" key="question">
            <h2 class="text-[clamp(1.6rem,2.8vw,2.1rem)] mb-2 text-center">¿Para quién es tu regalo?</h2>
            <p class="text-center text-(--ink-soft) mb-8">Responde una pregunta y te decimos qué armar.</p>
            <div class="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
              <button
                v-for="opt in options"
                :key="opt.categoryId"
                type="button"
                class="flex items-center justify-between gap-2.5 py-4.5 px-5 rounded-input border border-(--line-strong) bg-(--bg) font-semibold text-[15px] text-left text-(--ink) transition-[border-color,background-color,transform] duration-250 ease-[ease] hover:border-(--accent) hover:bg-(--accent-tint) hover:-translate-y-0.5"
                @click="pick(opt.categoryId)"
              >
                {{ opt.label }}
                <PhArrowRight :size="16" weight="bold" />
              </button>
            </div>
          </div>

          <div v-else key="result">
            <button
              type="button"
              class="inline-flex items-center gap-1.5 bg-transparent border-0 text-(--ink-soft) text-[13px] font-semibold mb-6 hover:text-(--ink)"
              @click="reset"
            >
              <PhArrowLeft :size="15" weight="bold" />
              Volver a intentar
            </button>
            <div class="grid grid-cols-[220px_1fr] gap-8 items-center max-sm:grid-cols-1">
              <div
                class="rounded-[20px] aspect-square p-5 flex items-center justify-center max-sm:max-w-[220px] max-sm:mx-auto"
                :style="{ background: result!.bgSoft }"
              >
                <GiftArt :variant="result!.art" />
              </div>
              <div>
                <span class="eyebrow">Te recomendamos</span>
                <h3 class="text-[clamp(1.5rem,2.6vw,2rem)] mt-1.5 mx-0 mb-3">{{ result!.name }}</h3>
                <p class="text-(--ink-soft) mb-5">{{ result!.tagline }}</p>
                <a href="#catalogo" class="btn btn-primary" @click="goToCatalog">
                  Ver {{ result!.name }}
                  <PhArrowRight :size="16" weight="bold" />
                </a>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Vue <Transition name="quiz-fade"> toggles these class names itself during
   enter/leave — not expressible as static utility classes on the element. */
.quiz-fade-enter-active,
.quiz-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.quiz-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.quiz-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
