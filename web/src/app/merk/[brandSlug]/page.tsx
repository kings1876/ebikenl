import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ALL_BRANDS } from '@/data/ebikes';
import { BrandPage } from '@/views/BrandPage';

const slugify = (b: string) => b.toLowerCase().replace(/[^a-z0-9]+/g, '-');

type Props = { params: Promise<{ brandSlug: string }> };

export function generateStaticParams() {
  return ALL_BRANDS.map((b) => ({ brandSlug: slugify(b) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brandSlug } = await params;
  const brand = ALL_BRANDS.find((b) => slugify(b) === brandSlug);
  if (!brand) return {};
  return {
    title: `${brand} elektrische fietsen kopen`,
    description: `Nieuwe ${brand} e-bikes via de officiële distributeur, met fabrieksgarantie en snelle levering.`,
    alternates: { canonical: `/merk/${brandSlug}` },
  };
}

export default async function Page({ params }: Props) {
  const { brandSlug } = await params;
  if (!ALL_BRANDS.some((b) => slugify(b) === brandSlug)) notFound();
  return <BrandPage />;
}
