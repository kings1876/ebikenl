import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PRODUCTS } from '@/data/ebikes';
import { ProductDetailPage } from '@/views/ProductDetailPage';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) return {};
  return {
    title: product.title,
    description: product.shortDescription,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: { images: [product.image] },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (!PRODUCTS.some((p) => p.slug === slug)) notFound();
  return <ProductDetailPage />;
}
