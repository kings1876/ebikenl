import type { Metadata } from 'next';
import { TaxonomyPage } from '@/views/TaxonomyPage';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta('nl', '/taxonomie', {
  title: 'Taxonomie & architectuur',
  noindex: true,
});

export default function Page() {
  return <TaxonomyPage />;
}
