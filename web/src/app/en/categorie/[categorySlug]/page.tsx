import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { CategoryPage } from '@/views/CategoryPage';
import { CATEGORY_META, pageMeta } from '@/lib/seo';
import { ACTIVE_CATEGORY_SLUGS } from '@/data/ebikes';

type Props = { params: Promise<{ categorySlug: string }> };

export function generateStaticParams() {
  return ACTIVE_CATEGORY_SLUGS.map((categorySlug) => ({ categorySlug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug } = await params;
  const c = CATEGORY_META[categorySlug];
  return c ? pageMeta('en', `/categorie/${categorySlug}`, c) : {};
}

export default async function Page({ params }: Props) {
  const { categorySlug } = await params;
  if (!ACTIVE_CATEGORY_SLUGS.includes(categorySlug)) notFound();
  return (
    <Suspense>
      <CategoryPage />
    </Suspense>
  );
}
