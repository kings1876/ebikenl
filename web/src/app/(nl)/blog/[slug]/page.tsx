import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import sharp from 'sharp';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { PostCard } from '@/components/blog/PostCard';
import { ProductPicks } from '@/components/blog/ProductPicks';
import { breadcrumbLd } from '@/lib/jsonld';
import { articleLd } from '@/lib/blog/jsonld';
import { renderMarkdown } from '@/lib/blog/markdown';
import { getAllPosts, getPost, TYPE_LABEL } from '@/lib/blog/posts';
import { SITE_NAME, SITE_URL } from '@/lib/seo';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

async function heroSize(src: string) {
  try {
    const m = await sharp(fs.readFileSync(path.join(process.cwd(), 'public', src))).metadata();
    return { width: m.width, height: m.height };
  } catch {
    return {};
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  const url = `${SITE_URL}/blog/${post.slug}`;
  const size = await heroSize(post.image);
  const image = { url: `${SITE_URL}${post.image}`, alt: post.imageAlt, ...size };
  return {
    title: { absolute: post.title },
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: 'article', siteName: SITE_NAME, locale: 'nl_NL', url, title: post.title, description: post.description, images: [image], publishedTime: post.date, modifiedTime: post.updated, section: post.categoryLabel },
    twitter: { card: 'summary_large_image', title: post.title, description: post.description, images: [image.url] },
  };
}

const formatDate = (iso: string) => new Date(iso).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });

export default async function Page({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  const all = getAllPosts();
  const picks = <ProductPicks slugs={post.products} category={post.category} categoryLabel={post.categoryLabel} />;
  const hasMarker = post.body.includes('[[picks]]');
  const { nodes, headings } = await renderMarkdown(post.body, picks);
  const size = await heroSize(post.image);

  const candidates = post.related.length ? post.related.map((s) => all.find((p) => p.slug === s)) : all.filter((p) => p.type === post.type);
  const related = candidates.filter((p): p is NonNullable<typeof p> => Boolean(p) && p!.slug !== post.slug).slice(0, 3);

  return (
    <>
      <JsonLd data={[breadcrumbLd('nl', [{ name: 'Blog', path: '/blog' }, { name: post.h1 }]), articleLd(post, size)]} />
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <Breadcrumbs items={[{ label: 'Blog', path: '/blog' }, { label: post.h1 }]} />
        <article>
          <header className="pb-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700">
              <span>{TYPE_LABEL[post.type]}</span>
              <span className="text-slate-300">·</span>
              <span className="font-semibold normal-case tracking-normal text-slate-500">{post.readingMinutes} min leestijd</span>
            </div>
            <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">{post.h1}</h1>
            <p className="mt-3 text-sm text-slate-500">
              Door de redactie van {SITE_NAME} · Bijgewerkt op <time dateTime={post.updated}>{formatDate(post.updated)}</time>
            </p>
          </header>

          <figure className="my-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.image} alt={post.imageAlt} width={size.width} height={size.height} loading="eager" fetchPriority="high" decoding="async" className="w-full rounded-2xl border border-slate-200 bg-white object-contain" style={{ aspectRatio: size.width ? `${size.width} / ${size.height}` : '4 / 3' }} />
          </figure>

          {headings.length > 2 && (
            <nav aria-label="Inhoud van dit artikel" className="my-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">In dit artikel</p>
              <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-slate-700 marker:font-bold marker:text-blue-600">
                {headings.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className="underline-offset-2 hover:text-blue-700 hover:underline">{h.text}</a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <div>{nodes}</div>
          {!hasMarker && picks}
        </article>

        {related.length > 0 && (
          <section aria-labelledby="related-heading" className="mt-14">
            <h2 id="related-heading" className="font-display text-2xl font-extrabold text-slate-900">Lees ook</h2>
            <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {related.map((p) => (
                <PostCard key={p.slug} post={p} minutes={p.readingMinutes} headingLevel="h3" />
              ))}
            </div>
            <p className="mt-6 text-center">
              <Link href="/blog" className="text-sm font-bold text-blue-700 underline underline-offset-2 hover:text-blue-900">Alle artikelen</Link>
            </p>
          </section>
        )}
      </div>
    </>
  );
}
