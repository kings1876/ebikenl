import type { ReactNode } from 'react';
import { RootLayoutBase, rootMetadata } from '@/components/RootLayoutBase';

export const metadata = rootMetadata('nl');

export default function Layout({ children }: { children: ReactNode }) {
  return <RootLayoutBase locale="nl">{children}</RootLayoutBase>;
}
