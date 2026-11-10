import type { Metadata } from 'next';
import { KeuzehulpPage } from '@/views/KeuzehulpPage';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta('nl', '/keuzehulp', {
  title: 'E-bike keuzehulp: vind jouw ideale fiets',
});

export default function Page() {
  return <KeuzehulpPage />;
}
