import type { Metadata } from 'next';
import { KeuzehulpPage } from '@/views/KeuzehulpPage';
import { pageMeta } from '@/lib/seo';
import { InfoBlock } from '@/components/InfoBlock';

export const metadata: Metadata = pageMeta('nl', '/keuzehulp', {
  title: 'E-bike keuzehulp: vind jouw ideale fiets',
  description: 'Beantwoord een paar vragen en vind de elektrische fiets die bij je past: voor woon-werkverkeer, sport of gezin. Vergelijk daarna modellen en adviesprijzen.',
});

export default function Page() {
  return (
    <>
      <KeuzehulpPage />
      <InfoBlock locale="nl" />
    </>
  );
}
