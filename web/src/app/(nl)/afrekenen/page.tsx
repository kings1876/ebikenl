import type { Metadata } from 'next';
import { CheckoutPage } from '@/views/CheckoutPage';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta('nl', '/afrekenen', {
  title: 'Veilig afrekenen',
  noindex: true,
});

export default function Page() {
  return <CheckoutPage />;
}
