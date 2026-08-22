<script setup lang="ts">
type Variant = 'breakfast' | 'flowers' | 'birthday' | 'kit'

const props = withDefaults(
  defineProps<{
    variant: Variant
    ink?: string
  }>(),
  { ink: '#1d1620' }
)
</script>

<template>
  <svg viewBox="0 0 400 400" class="w-full h-full overflow-visible" role="img" :aria-label="variant" preserveAspectRatio="xMidYMax meet">
    <defs>
      <filter id="softshadow" x="-40%" y="-40%" width="180%" height="180%">
        <feDropShadow dx="0" dy="14" stdDeviation="14" flood-color="#1d1620" flood-opacity="0.16" />
      </filter>
    </defs>

    <!-- Desayunos Sorpresa: bandeja con café, croissant y naranja -->
    <g v-if="props.variant === 'breakfast'" filter="url(#softshadow)">
      <rect x="52" y="238" width="296" height="34" rx="17" fill="#fff8f2" />
      <ellipse cx="200" cy="255" rx="150" ry="17" fill="#ffe3cf" />
      <circle cx="128" cy="196" r="54" fill="#fffaf3" />
      <path d="M104 178c8-20 40-20 48 0" stroke="#c98a4b" stroke-width="7" fill="none" stroke-linecap="round" />
      <rect x="176" y="150" width="70" height="70" rx="16" fill="#fff1e0" />
      <path d="M188 176c14-16 44-16 46 4-2 20-32 22-46 6z" fill="#e8a95c" />
      <circle cx="292" cy="188" r="42" fill="#ff9a62" />
      <circle cx="292" cy="188" r="42" fill="none" stroke="#fff5eb" stroke-width="3" />
      <path d="M292 152v72M258 188h68M267 163l50 50M317 163l-50 50" stroke="#fff5eb" stroke-width="3" />
      <path d="M112 210c26 26 60 26 86 0" stroke="#e2a45b" stroke-width="6" fill="none" stroke-linecap="round" />
    </g>

    <!-- Regalos Románticos: ramo de flores -->
    <g v-else-if="props.variant === 'flowers'" filter="url(#softshadow)">
      <path d="M170 400 200 232 230 400Z" fill="#8a9a6b" opacity="0.7" />
      <path d="M186 400 200 250 214 400Z" fill="#6e8055" />
      <circle cx="146" cy="188" r="46" fill="#f2879b" />
      <circle cx="234" cy="176" r="52" fill="#e8546f" />
      <circle cx="200" cy="126" r="48" fill="#f7a8b8" />
      <circle cx="262" cy="222" r="38" fill="#f2879b" />
      <circle cx="138" cy="240" r="34" fill="#f7c6d0" />
      <circle cx="200" cy="126" r="14" fill="#fff1e8" />
      <circle cx="146" cy="188" r="12" fill="#fff1e8" />
      <circle cx="234" cy="176" r="13" fill="#fff1e8" />
      <path d="M150 246c22 16 78 16 100 0" stroke="#c1275a" stroke-width="6" fill="none" stroke-linecap="round" />
    </g>

    <!-- Cumpleaños: caja sorpresa con globos -->
    <g v-else-if="props.variant === 'birthday'" filter="url(#softshadow)">
      <circle cx="120" cy="120" r="46" fill="#f6c945" />
      <circle cx="216" cy="86" r="38" fill="#f4a13a" />
      <circle cx="300" cy="140" r="44" fill="#f6c945" />
      <path d="M120 166v70M216 124v96M300 184v58" stroke="#c98a1f" stroke-width="3" fill="none" />
      <rect x="132" y="252" width="140" height="112" rx="14" fill="#fff4d9" />
      <rect x="132" y="252" width="140" height="34" rx="14" fill="#f6c945" />
      <rect x="190" y="252" width="24" height="112" fill="#f4a13a" />
      <path d="M182 252c-6-24 32-24 26 0" stroke="#f4a13a" stroke-width="8" fill="none" />
    </g>

    <!-- Bandejas de Sabores: caja kit entreabierta -->
    <g v-else filter="url(#softshadow)">
      <rect x="96" y="196" width="208" height="150" rx="18" fill="#eaf3ea" />
      <path d="M96 214 200 170 304 214 200 258Z" fill="#a9cdb3" />
      <path d="M200 258v88" stroke="#6f9a7c" stroke-width="3" />
      <rect x="150" y="120" width="46" height="70" rx="10" fill="#8fc9a9" transform="rotate(-8 150 120)" />
      <circle cx="238" cy="146" r="26" fill="#f2879b" />
      <rect x="176" y="284" width="70" height="46" rx="8" fill="#fff8ee" />
      <path d="M176 300h70" stroke="#c9c0aa" stroke-width="3" />
    </g>
  </svg>
</template>
