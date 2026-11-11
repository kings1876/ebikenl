import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'E-BIKE-TEKOOP.NL',
    short_name: 'E-BIKE-TEKOOP',
    description: 'Vergelijk nieuwe elektrische fietsen: modellen, specificaties en adviesprijzen.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    lang: 'nl-NL',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
