import type { Metadata } from 'next';
import { ConfirmPaymentPage } from '@/views/ConfirmPaymentPage';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = {
  ...pageMeta('nl', '/order/confirm-payment', { title: 'Betaalbevestiging uploaden', noindex: true }),
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ConfirmPaymentPage />;
}
