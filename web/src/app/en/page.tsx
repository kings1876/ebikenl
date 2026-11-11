import type { Metadata } from 'next';
import { HomePage } from '@/views/HomePage';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta('en', '/', {
  title: 'Elektrische fiets kopen | Nieuwe e-bikes van Cube, Giant, Scott',
  absoluteTitle: true,
  description: 'Vergelijk nieuwe elektrische fietsen van Cube, Giant, Scott, Specialized en Kalkhoff. Bekijk modellen, specificaties en adviesprijzen op één plek.',
});

export default function Page() {
  return <HomePage />;
}
