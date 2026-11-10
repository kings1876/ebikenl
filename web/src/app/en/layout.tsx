import type { ReactNode } from 'react';
import { RootLayoutBase, rootMetadata } from '@/components/RootLayoutBase';

export const metadata = rootMetadata('en');

export default function Layout({ children }: { children: ReactNode }) {
  return <RootLayoutBase locale="en">{children}</RootLayoutBase>;
}
