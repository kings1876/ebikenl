'use client';

// Client half of PostCard: same markup, but it arrives as a handful of props instead of a server-rendered tree,
// so the blog pages' framework payload does not repeat every card's markup and class names.
import Link from 'next/link';

const thumb = (src: string) => (src.startsWith('/images/catalog/') ? src.replace(/\.webp$/, '-sm.webp') : src);

export type PostCardProps = { slug: string; typeLabel: string; image: string; h1: string; description: string; minutes: number; headingLevel: 'h2' | 'h3' };

export function PostCardView({ slug, typeLabel, image, h1, description, minutes, headingLevel }: PostCardProps) {
  const Heading = headingLevel;
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-md">
      <Link prefetch={false} href={`/blog/${slug}`} className="block aspect-[4/3] overflow-hidden bg-white" tabIndex={-1} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={thumb(image)} alt="" width={480} height={360} loading="lazy" decoding="async" className="h-full w-full object-contain p-2 transition-transform group-hover:scale-[1.02]" />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-blue-700">
          <span>{typeLabel}</span>
          <span className="text-slate-300">·</span>
          <span className="font-semibold normal-case tracking-normal text-slate-500">{minutes} min leestijd</span>
        </div>
        <Heading className="font-display text-lg font-extrabold leading-snug text-slate-900">
          <Link prefetch={false} href={`/blog/${slug}`} className="hover:text-blue-700">{h1}</Link>
        </Heading>
        <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">{description}</p>
      </div>
    </article>
  );
}
