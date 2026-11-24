import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';
import { ServicePageView } from '@/components/ServiceView';
import { SERVICE_PAGES, SERVICE_QA, serviceBySlug } from '@/data/service';
import { pageMeta } from '@/lib/seo';
import { breadcrumbLd } from '@/lib/jsonld';

type Props = { params: Promise<{ slug: string }> };

const TOPICS = SERVICE_PAGES.map(({ slug, label, description }) => ({ slug, label, description }));

export function generateStaticParams() {
  return SERVICE_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = serviceBySlug(slug);
  if (!page) return {};
  const path = `/klantenservice/${slug}`;
  // Dutch only (like the blog): no English alternates.
  return { ...pageMeta('nl', path, { title: page.title, description: page.description }), alternates: { canonical: path } };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const page = serviceBySlug(slug);
  if (!page) notFound();
  return (
    <>
      <JsonLd
        data={breadcrumbLd('nl', [
          { name: 'Klantenservice', path: '/klantenservice' },
          { name: page.label, path: `/klantenservice/${slug}` },
        ])}
      />
      <ServicePageView page={page} qa={SERVICE_QA[slug] ?? []} topics={TOPICS} />
    </>
  );
}
