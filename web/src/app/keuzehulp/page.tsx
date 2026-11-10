import type { Metadata } from 'next';
import { KeuzehulpPage } from '@/views/KeuzehulpPage';

export const metadata: Metadata = {
  title: 'E-bike keuzehulp: vind jouw ideale fiets',
};

export default function Page() {
  return <KeuzehulpPage />;
}
