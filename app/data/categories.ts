export interface Category {
  id: string
  name: string
  /** Texto grande de fondo del hero. Admite '\n' para forzar el salto de línea
   * exactamente donde se escriba. Si no se define, usa `name` en una sola línea. */
  heroLabel?: string
  art: 'breakfast' | 'flowers' | 'birthday' | 'kit'
  bg: string
  bgSoft: string
  decor: string
  ink: string
  tagline: string
  priceFrom: number
  productImage: string
  decorImage?: string
}

export const categories: Category[] = [
  {
    id: 'desayunos',
    name: 'Desayunos\nSorpresa',
    art: 'breakfast',
    bg: '#f7a35f',
    bgSoft: '#ffe4c9',
    decor: '#fff1de',
    ink: '#3a2410',
    tagline: 'Una bandeja que huele a café recién hecho antes de que abran los ojos.',
    priceFrom: 38,
    productImage: '/desayuno/caja.png',
    decorImage: '/desayuno/globos.png',
  },
  {
    id: 'romanticos',
    name: 'Regalos\nRománticos',
    art: 'flowers',
    bg: '#e8768c',
    bgSoft: '#fbd9e0',
    decor: '#fff0f3',
    ink: '#3a121c',
    tagline: 'Flores frescas y una nota escrita a mano para decir lo que a veces cuesta decir.',
    priceFrom: 39,
    productImage: '/regalos/caja.png',
    decorImage: '/regalos/globo.png',
  },
  {
    id: 'cumpleanos',
    name: 'Cumpleaños',
    art: 'birthday',
    bg: '#f3c55d',
    bgSoft: '#fde9bd',
    decor: '#fff8e6',
    ink: '#3a2c08',
    tagline: 'Globos, caja sorpresa y todo el ruido bonito que merece un año más.',
    priceFrom: 70,
    productImage: '/cumple/torta,caja,gorro.png',
    decorImage: '/cumple/globos.png',
  },
  {
    id: 'kits',
    name: 'Bandejas de Sabores',
    heroLabel: 'Bandejas\nde Sabores',
    art: 'kit',
    bg: '#8fc9a9',
    bgSoft: '#dcefe1',
    decor: '#f2faf4',
    ink: '#122c1c',
    tagline: 'Bandejas dulces y saladas para picar y compartir, armadas al momento.',
    priceFrom: 39,
    productImage: '/kits/kit.png',
  },
]
