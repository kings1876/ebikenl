import type { Metadata } from 'next';
import { KeuzehulpPage } from '@/views/KeuzehulpPage';
import { pageMeta } from '@/lib/seo';
import { InfoBlock } from '@/components/InfoBlock';
import { ListingGuide } from '@/components/ListingGuide';
import { listingStats } from '@/lib/listingStats';
import { CARD_PRODUCTS } from '@/data/slim';

export const metadata: Metadata = pageMeta('nl', '/keuzehulp', {
  title: 'E-bike keuzehulp: vind jouw ideale fiets',
  description: 'Beantwoord een paar vragen en vind de elektrische fiets die bij je past: voor woon-werkverkeer, sport of gezin. Vergelijk daarna modellen en adviesprijzen.',
});

export default function Page() {
  return (
    <>
      <KeuzehulpPage />
      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <ListingGuide name={'Ons assortiment'} stats={listingStats(CARD_PRODUCTS)} />
      </div>
      <InfoBlock locale="nl" />
    </>
  );
}
