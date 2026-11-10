import type { Metadata } from 'next';
import { CartPage } from '@/views/CartPage';

export const metadata: Metadata = {
  title: 'Winkelwagen',
  robots: { index: false, follow: true },
};

export default function Page() {
  return <CartPage />;
}
