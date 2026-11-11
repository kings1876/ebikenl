import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BRANDS_WITH_PRODUCTS } from '@/data/ebikes';
import { BrandPage } from '@/views/BrandPage';
import { brandSlug as slugify, pageMeta, tx } from '@/lib/seo';

type Props = { params: Promise<{ brandSlug: string }> };

export function generateStaticParams() {
  return BRANDS_WITH_PRODUCTS.map((b) => ({ brandSlug: slugify(b) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brandSlug } = await params;
  const brand = BRANDS_WITH_PRODUCTS.find((b) => slugify(b) === brandSlug);
  if (!brand) return {};
  const fill = (s: string) => tx('nl', s).replace(/\{brand\}/g, brand);
  return {
    ...pageMeta('nl', `/merk/${brandSlug}`, { title: '{brand} elektrische fiets kopen' }),
    title: fill('{brand} elektrische fiets kopen'),
    description: fill('Bekijk alle {brand} e-bikes: modellen, specificaties en adviesprijzen. Nieuw en met fabrieksgarantie.'),
  };
}

export default async function Page({ params }: Props) {
  const { brandSlug } = await params;
  if (!BRANDS_WITH_PRODUCTS.some((b) => slugify(b) === brandSlug)) notFound();
  return <BrandPage />;
}
