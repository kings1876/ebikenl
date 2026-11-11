import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CATEGORY_SLUG_TO_MAIN } from '@/data/ebikes';
import { PRODUCTS } from '@/data/catalog';
import { CARD_PRODUCTS } from '@/data/slim';
import { ProductDetailPage } from '@/views/ProductDetailPage';
import { JsonLd } from '@/components/JsonLd';
import { pageMeta, brandSlug } from '@/lib/seo';
import { breadcrumbLd, productLd } from '@/lib/jsonld';
import { productMeta } from '@/lib/productSeo';
import { SUB_COPY, subSlug } from '@/lib/seoCopy';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) return {};
  const m = productMeta(product, 'nl');
  return pageMeta('nl', `/product/${product.slug}`, {
    title: m.title,
    absoluteTitle: m.absolute,
    description: m.description,
    images: [product.image],
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) notFound();
  const catSlug = Object.keys(CATEGORY_SLUG_TO_MAIN).find((k) => CATEGORY_SLUG_TO_MAIN[k] === product.category) ?? 'elektrische-fietsen';
  const related = PRODUCTS.filter((p) => p.id !== product.id && (p.brand === product.brand || p.subCategory === product.subCategory))
    .slice(0, 3)
    .map(({ id }) => CARD_PRODUCTS.find((c) => c.id === id)!);
  const crumbs = [
    { name: product.category, path: `/categorie/${catSlug}` },
    ...(SUB_COPY[product.subCategory] ? [{ name: product.subCategory, path: `/categorie/${catSlug}/${subSlug(product.subCategory)}` }] : []),
    { name: product.brand, path: `/merk/${brandSlug(product.brand)}` },
    { name: product.title },
  ];
  return (
    <>
      <JsonLd data={[productLd(product, 'nl'), breadcrumbLd('nl', crumbs)]} />
      <ProductDetailPage product={product} related={related} />
    </>
  );
}
