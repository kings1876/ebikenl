import type { Metadata } from 'next';
import { PostCard } from '@/components/blog/PostCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbLd } from '@/lib/jsonld';
import { blogLd } from '@/lib/blog/jsonld';
import { getAllPosts } from '@/lib/blog/posts';
import type { PostType } from '@/lib/blog/posts';
import { SITE_NAME, SITE_URL } from '@/lib/seo';

const TITLE = 'Elektrische fiets blog: koopgidsen, vergelijkingen en uitleg';
const DESCRIPTION = 'Praktische koopgidsen, vergelijkingen en uitleg over elektrische fietsen: motor, accu, framemaat, regels en welk model bij je past.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: '/blog' },
  openGraph: { type: 'website', siteName: SITE_NAME, locale: 'nl_NL', url: `${SITE_URL}/blog`, title: TITLE, description: DESCRIPTION, images: [{ url: `${SITE_URL}/opengraph-image.png`, width: 1200, height: 630, alt: SITE_NAME }] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [`${SITE_URL}/opengraph-image.png`] },
};

const ORDER: { type: PostType; heading: string; intro: string }[] = [
  { type: 'transactional', heading: 'Koopgidsen', intro: 'Per type e-bike: waar je op let, welke modellen in onze catalogus passen en wat de belangrijkste verschillen zijn.' },
  { type: 'commercial', heading: 'Vergelijkingen', intro: 'Merken, motoren en prijsklassen naast elkaar gezet, zodat je sneller een keuze maakt.' },
  { type: 'informational', heading: 'Uitleg', intro: 'Hoe een elektrische fiets werkt, hoe je een accu verzorgt en welke regels gelden.' },
];

export default function Page() {
  const posts = getAllPosts();
  return (
    <>
      <JsonLd data={[breadcrumbLd('nl', [{ name: 'Blog', path: '/blog' }]), blogLd(posts)]} />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Blog' }]} />
        <header className="max-w-3xl pb-6">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">E-bike blog: koopgidsen, vergelijkingen en uitleg</h1>
          <p className="mt-3 text-base leading-7 text-slate-600">{DESCRIPTION} Alle artikelen verwijzen naar modellen uit onze catalogus, met specificaties en adviesprijzen.</p>
        </header>
        {ORDER.map(({ type, heading, intro }) => {
          const group = posts.filter((p) => p.type === type);
          if (!group.length) return null;
          return (
            <section key={type} className="mb-12" aria-labelledby={`g-${type}`}>
              <h2 id={`g-${type}`} className="font-display text-2xl font-extrabold text-slate-900">{heading}</h2>
              <p className="mt-1 mb-5 max-w-3xl text-sm text-slate-600">{intro}</p>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {group.map((p) => (
                  <PostCard key={p.slug} post={p} minutes={p.readingMinutes} headingLevel="h3" />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
