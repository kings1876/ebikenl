import type { Metadata } from 'next';
import { HomePage } from '@/views/HomePage';
import { pageMeta } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import { HomeBlog } from '@/components/blog/HomeBlog';
import { websiteLd } from '@/lib/jsonld';
import { featuredHomeProducts } from '@/lib/home';
import { listingStats } from '@/lib/listingStats';
import { CARD_PRODUCTS } from '@/data/slim';

export const metadata: Metadata = pageMeta('nl', '/', {
  title: 'Elektrische fiets kopen | E-bikes van Cube, Giant, Scott',
  absoluteTitle: true,
  description: 'Vergelijk nieuwe elektrische fietsen van Cube, Giant, Scott, Specialized en Kalkhoff. Bekijk modellen, specificaties en adviesprijzen op één plek.',
});

export default function Page() {
  return (
    <>
      <JsonLd data={websiteLd('nl')} />
      <HomePage featuredProducts={featuredHomeProducts()} stats={listingStats(CARD_PRODUCTS)} />
      <HomeBlog />
    </>
  );
}
