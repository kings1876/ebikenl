import type { Metadata } from 'next';
import { OrderConfirmationPage } from '@/views/OrderConfirmationPage';

export const metadata: Metadata = {
  title: 'Bestelling bevestigd',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <OrderConfirmationPage />;
}
