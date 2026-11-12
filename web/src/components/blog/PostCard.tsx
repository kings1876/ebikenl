import Link from 'next/link';
import { TYPE_LABEL } from '@/lib/blog/posts';
import type { PostMeta } from '@/lib/blog/posts';

const thumb = (src: string) => (src.startsWith('/images/catalog/') ? src.replace(/\.webp$/, '-sm.webp') : src);

export function PostCard({ post, minutes, headingLevel = 'h2' }: { post: PostMeta; minutes: number; headingLevel?: 'h2' | 'h3' }) {
  const Heading = headingLevel;
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-md">
      <Link prefetch={false} href={`/blog/${post.slug}`} className="block aspect-[4/3] overflow-hidden bg-white" tabIndex={-1} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={thumb(post.image)} alt="" width={480} height={360} loading="lazy" decoding="async" className="h-full w-full object-contain p-2 transition-transform group-hover:scale-[1.02]" />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-blue-700">
          <span>{TYPE_LABEL[post.type]}</span>
          <span className="text-slate-300">·</span>
          <span className="font-semibold normal-case tracking-normal text-slate-500">{minutes} min leestijd</span>
        </div>
        <Heading className="font-display text-lg font-extrabold leading-snug text-slate-900">
          <Link prefetch={false} href={`/blog/${post.slug}`} className="hover:text-blue-700">{post.h1}</Link>
        </Heading>
        <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">{post.description}</p>
      </div>
    </article>
  );
}
