import type { Metadata } from 'next';
import { ComparePage } from '@/views/ComparePage';

export const metadata: Metadata = {
  title: 'E-bikes vergelijken',
  robots: { index: false, follow: true },
};

export default function Page() {
  return <ComparePage />;
}
