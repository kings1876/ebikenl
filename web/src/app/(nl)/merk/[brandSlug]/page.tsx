import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ALL_BRANDS } from '@/data/ebikes';
import { BrandPage } from '@/views/BrandPage';
import { brandSlug as slugify, pageMeta, tx } from '@/lib/seo';

type Props = { params: Promise<{ brandSlug: string }> };

export function generateStaticParams() {
  return ALL_BRANDS.map((b) => ({ brandSlug: slugify(b) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brandSlug } = await params;
  const brand = ALL_BRANDS.find((b) => slugify(b) === brandSlug);
  if (!brand) return {};
  const fill = (s: string) => tx('nl', s).replace('{brand}', brand);
  return {
    ...pageMeta('nl', `/merk/${brandSlug}`, { title: '{brand} elektrische fietsen kopen' }),
    title: fill('{brand} elektrische fietsen kopen'),
    description: fill('Nieuwe {brand} e-bikes via de officiële distributeur, met fabrieksgarantie en snelle levering.'),
  };
}

export default async function Page({ params }: Props) {
  const { brandSlug } = await params;
  if (!ALL_BRANDS.some((b) => slugify(b) === brandSlug)) notFound();
  return <BrandPage />;
}
