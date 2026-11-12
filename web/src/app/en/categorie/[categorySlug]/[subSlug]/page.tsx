import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CategoryPage } from '@/views/CategoryPage';
import { JsonLd } from '@/components/JsonLd';
import { pageMeta } from '@/lib/seo';
import { breadcrumbLd } from '@/lib/jsonld';
import { SUB_COPY, subSlug } from '@/lib/seoCopy';
import { CATEGORY_SLUG_TO_MAIN } from '@/data/ebikes';
import { ACTIVE_TAXONOMY_CATEGORIES, PRODUCTS } from '@/data/catalog';
import { ModelIndex } from '@/components/ModelIndex';
import { tx } from '@/lib/seo';
import type { SubCategory } from '@/types/ebike';
import { categorySeed } from '@/lib/listingSeed';

type Props = { params: Promise<{ categorySlug: string; subSlug: string }> };

// Subcategories with their own page: those that hold products and have copy. Speed pedelecs live on /speed-pedelecs.
const entries = () =>
  ACTIVE_TAXONOMY_CATEGORIES.flatMap((cat) =>
    cat.subs
      .filter((sub) => SUB_COPY[sub])
      .map((sub) => ({ categorySlug: Object.keys(CATEGORY_SLUG_TO_MAIN).find((k) => CATEGORY_SLUG_TO_MAIN[k] === cat.main)!, sub, slug: subSlug(sub) })),
  );

export function generateStaticParams() {
  return entries().map((e) => ({ categorySlug: e.categorySlug, subSlug: e.slug }));
}

const find = (categorySlug: string, slug: string) => entries().find((e) => e.categorySlug === categorySlug && e.slug === slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug, subSlug: slug } = await params;
  const hit = find(categorySlug, slug);
  const copy = hit && SUB_COPY[hit.sub];
  if (!hit || !copy) return {};
  return pageMeta('en', `/categorie/${categorySlug}/${slug}`, { title: copy.title, description: copy.description });
}

export default async function Page({ params }: Props) {
  const { categorySlug, subSlug: slug } = await params;
  const hit = find(categorySlug, slug);
  if (!hit) notFound();
  return (
    <>
      <JsonLd
        data={breadcrumbLd('en', [
          { name: CATEGORY_SLUG_TO_MAIN[categorySlug], path: `/categorie/${categorySlug}` },
          { name: hit.sub as SubCategory, path: `/categorie/${categorySlug}/${slug}` },
        ])}
      />
      <CategoryPage subCategory={hit.sub as SubCategory} seed={categorySeed(CATEGORY_SLUG_TO_MAIN[categorySlug], hit.sub as SubCategory)} />
      <ModelIndex locale="en" groupBy="brand" title={tx('en', hit.sub)} products={PRODUCTS.filter((p) => p.subCategory === hit.sub)} />
    </>
  );
}
