import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { CategoryPage } from '@/views/CategoryPage';
import { CATEGORY_META, pageMeta } from '@/lib/seo';

type Props = { params: Promise<{ categorySlug: string }> };

export function generateStaticParams() {
  return Object.keys(CATEGORY_META).map((categorySlug) => ({ categorySlug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug } = await params;
  const c = CATEGORY_META[categorySlug];
  return c ? pageMeta('nl', `/categorie/${categorySlug}`, c) : {};
}

export default async function Page({ params }: Props) {
  const { categorySlug } = await params;
  if (!CATEGORY_META[categorySlug]) notFound();
  return (
    <Suspense>
      <CategoryPage />
    </Suspense>
  );
}
