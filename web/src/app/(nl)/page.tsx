import type { Metadata } from 'next';
import { HomePage } from '@/views/HomePage';
import { pageMeta } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import { websiteLd } from '@/lib/jsonld';

export const metadata: Metadata = pageMeta('nl', '/', {
  title: 'Elektrische fiets kopen | E-bikes van Cube, Giant, Scott',
  absoluteTitle: true,
  description: 'Vergelijk nieuwe elektrische fietsen van Cube, Giant, Scott, Specialized en Kalkhoff. Bekijk modellen, specificaties en adviesprijzen op één plek.',
});

export default function Page() {
  return (
    <>
      <JsonLd data={websiteLd('nl')} />
      <HomePage />
    </>
  );
}
