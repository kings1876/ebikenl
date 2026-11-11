import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BRANDS_WITH_PRODUCTS } from '@/data/ebikes';
import { BrandPage } from '@/views/BrandPage';
import { JsonLd } from '@/components/JsonLd';
import { brandSlug as slugify, pageMeta, tx } from '@/lib/seo';
import { breadcrumbLd } from '@/lib/jsonld';

type Props = { params: Promise<{ brandSlug: string }> };

export function generateStaticParams() {
  return BRANDS_WITH_PRODUCTS.map((b) => ({ brandSlug: slugify(b) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brandSlug } = await params;
  const brand = BRANDS_WITH_PRODUCTS.find((b) => slugify(b) === brandSlug);
  if (!brand) return {};
  const fill = (s: string) => tx('en', s).replace(/{brand}/g, brand);
  return {
    ...pageMeta('en', `/merk/${brandSlug}`, { title: '{brand} elektrische fiets kopen' }),
    title: fill('{brand} elektrische fiets kopen'),
    description: fill('Bekijk alle {brand} e-bikes op één plek: vergelijk modellen, specificaties en adviesprijzen. Nieuw, met de fabrieksgarantie van de fabrikant.'),
  };
}

export default async function Page({ params }: Props) {
  const { brandSlug } = await params;
  const brand = BRANDS_WITH_PRODUCTS.find((b) => slugify(b) === brandSlug);
  if (!brand) notFound();
  return (
    <>
      <JsonLd data={breadcrumbLd('en', [{ name: brand, path: `/merk/${brandSlug}` }])} />
      <BrandPage />
    </>
  );
}
