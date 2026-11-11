import Link from 'next/link';
import { PostCard } from './PostCard';
import { getPost } from '@/lib/blog/posts';

// The three articles featured on the homepage (chosen for search demand and purchase intent).
const FEATURED = ['cube-elektrische-fiets-kopen', 'beste-elektrische-fiets-2026', 'elektrische-fiets-met-lage-instap-kopen'];

/** Homepage widget: three blog posts in three columns, shown just above the footer. */
export function HomeBlog() {
  const posts = FEATURED.map((slug) => getPost(slug)).filter((p): p is NonNullable<typeof p> => Boolean(p));
  if (posts.length < 3) return null;
  return (
    <section aria-labelledby="home-blog-heading" className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="home-blog-heading" className="font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Uit onze blog</h2>
          <p className="mt-1 text-sm text-slate-600">Koopgidsen en uitleg om sneller de juiste e-bike te kiezen.</p>
        </div>
        <Link href="/blog" className="text-sm font-bold text-blue-700 underline underline-offset-2 hover:text-blue-900">Alle artikelen</Link>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        {posts.map((p) => (
          <PostCard key={p.slug} post={p} minutes={p.readingMinutes} headingLevel="h3" />
        ))}
      </div>
    </section>
  );
}
