import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BRANDS_WITH_PRODUCTS, PRODUCTS } from '@/data/catalog';
import { ModelIndex } from '@/components/ModelIndex';
import { InfoBlock } from '@/components/InfoBlock';
import { brandProducts } from '@/lib/listingSeed';
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
  const fill = (s: string) => tx('nl', s).replace(/{brand}/g, brand);
  return {
    ...pageMeta('nl', `/merk/${brandSlug}`, { title: '{brand} elektrische fiets kopen' }),
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
      <JsonLd data={breadcrumbLd('nl', [{ name: brand, path: `/merk/${brandSlug}` }])} />
      <BrandPage products={brandProducts(brand)} />
      <ModelIndex locale="nl" groupBy="subCategory" title={brand} products={PRODUCTS.filter((p) => p.brand === brand)} />
      <InfoBlock locale="nl" />
    </>
  );
}
