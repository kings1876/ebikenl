import type { Metadata } from 'next';
import { KeuzehulpPage } from '@/views/KeuzehulpPage';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta('en', '/keuzehulp', {
  title: 'E-bike keuzehulp: vind jouw ideale fiets',
  description: 'Beantwoord een paar vragen en vind de elektrische fiets die bij je past: voor woon-werkverkeer, sport of gezin. Vergelijk daarna modellen en adviesprijzen.',
});

export default function Page() {
  return <KeuzehulpPage />;
}
