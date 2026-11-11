import type { Metadata } from 'next';
import { PaymentDetailsPage } from '@/views/PaymentDetailsPage';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = {
  ...pageMeta('nl', '/order/payment-details', { title: 'Betaalgegevens', noindex: true }),
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PaymentDetailsPage />;
}
