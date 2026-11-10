import type { Metadata } from 'next';
import { HomePage } from '@/views/HomePage';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta('en', '/', {
  title: 'E-BIKE-TEKOOP.NL | Nieuwe elektrische fietsen van A-merken',
  absoluteTitle: true,
  description: 'Nieuwe elektrische fietsen van A-merken met fabrieksgarantie en snelle levering. Betaal met iDEAL, bankoverschrijving of crypto.',
});

export default function Page() {
  return <HomePage />;
}
