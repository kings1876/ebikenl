import type { Metadata } from 'next';
import { CartPage } from '@/views/CartPage';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta('en', '/winkelwagen', {
  title: 'Winkelwagen',
  noindex: true,
});

export default function Page() {
  return <CartPage />;
}
