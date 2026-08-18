export interface Product {
  id: string
  name: string
  categoryId: string
  price: number
  variants: string[]
  blurb: string
  featured?: boolean
}

export const products: Product[] = [
  {
    id: 'bandeja-amanecer',
    name: 'Bandeja Amanecer Clásico',
    categoryId: 'desayunos',
    price: 32,
    variants: ['Para 1', 'Para 2'],
    blurb: 'Café recién hecho, pan dulce, fruta de temporada y jugo natural.',
  },
  {
    id: 'brunch-completo',
    name: 'Bandeja Brunch Completo',
    categoryId: 'desayunos',
    price: 48,
    variants: ['Para 2', 'Para 4'],
    blurb: 'Huevos al gusto, waffles, mimosa sin alcohol y mermelada casera.',
  },
  {
    id: 'ramo-primer-te',
    name: 'Ramo Primer Té',
    categoryId: 'romanticos',
    price: 45,
    variants: ['12 rosas', '18 rosas', '24 rosas'],
    blurb: 'Rosas frescas envueltas a mano, con una nota que tú escribes.',
  },
  {
    id: 'amor-en-flor',
    name: 'Caja Amor en Flor',
    categoryId: 'romanticos',
    price: 62,
    variants: ['Clásica', 'Deluxe'],
    blurb: 'Flores, chocolate belga y una vela aromática para cerrar la noche.',
    featured: true,
  },
  {
    id: 'sorpresa-confeti',
    name: 'Caja Sorpresa Confeti',
    categoryId: 'cumpleanos',
    price: 38,
    variants: ['Chica', 'Grande'],
    blurb: 'Globos, serpentina y un pastel individual de regalo.',
  },
  {
    id: 'fiesta-en-casa',
    name: 'Kit Fiesta en Casa',
    categoryId: 'cumpleanos',
    price: 55,
    variants: ['Para 4', 'Para 8'],
    blurb: 'Decoración, velas y todo lo necesario para armar la fiesta en diez minutos.',
  },
  {
    id: 'noche-peliculas',
    name: 'Kit Noche de Películas',
    categoryId: 'kits',
    price: 42,
    variants: ['Dulce', 'Salado'],
    blurb: 'Palomitas, dulces y una manta suave para la maratón de esta noche.',
  },
  {
    id: 'spa-en-casa',
    name: 'Kit Spa en Casa',
    categoryId: 'kits',
    price: 58,
    variants: ['Relax', 'Detox'],
    blurb: 'Mascarillas, velas y té de hierbas para un día de descanso total.',
  },
]
