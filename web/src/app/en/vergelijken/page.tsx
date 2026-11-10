import type { Metadata } from 'next';
import { ComparePage } from '@/views/ComparePage';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta('en', '/vergelijken', {
  title: 'E-bikes vergelijken',
  noindex: true,
});

export default function Page() {
  return <ComparePage />;
}
