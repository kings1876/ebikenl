import type { Metadata } from 'next';
import { OrderConfirmationPage } from '@/views/OrderConfirmationPage';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = {
  ...pageMeta('en', '/bestelling-bevestigd', { title: 'Bestelling bevestigd', noindex: true }),
  robots: { index: false, follow: false },
};

export default function Page() {
  return <OrderConfirmationPage />;
}
