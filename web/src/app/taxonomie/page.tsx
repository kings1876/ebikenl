import type { Metadata } from 'next';
import { TaxonomyPage } from '@/views/TaxonomyPage';

export const metadata: Metadata = {
  title: 'Taxonomie & architectuur',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <TaxonomyPage />;
}
