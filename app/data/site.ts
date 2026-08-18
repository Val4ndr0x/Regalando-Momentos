export const WHATSAPP_NUMBER = '525500000000'

export function waLink(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
}

export const SITE = {
  email: 'hola@regalandomomentos.com',
  phoneDisplay: '+52 55 0000 0000',
  city: 'Ciudad de México',
  instagram: 'https://instagram.com/regalandomomentos',
  facebook: 'https://facebook.com/regalandomomentos',
  tiktok: 'https://tiktok.com/@regalandomomentos',
}
