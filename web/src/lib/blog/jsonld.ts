// Article / Blog structured data. Author and publisher are the shop itself: no invented people.
import { SITE_NAME, SITE_URL } from '@/lib/seo';
import type { Post } from './posts';

const abs = (p: string) => (p.startsWith('http') ? p : `${SITE_URL}${p}`);

const PUBLISHER = {
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: { '@type': 'ImageObject', url: `${SITE_URL}/apple-icon.png` },
};

export function articleLd(post: Post, image: { width?: number; height?: number }) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: post.h1,
    description: post.description,
    image: [{ '@type': 'ImageObject', url: abs(post.image), ...(image.width ? { width: image.width, height: image.height } : {}) }],
    datePublished: post.date,
    dateModified: post.updated,
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: PUBLISHER,
    inLanguage: 'nl-NL',
    articleSection: post.categoryLabel,
    keywords: post.keyword,
    wordCount: post.words,
  };
}

export function blogLd(posts: Post[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${SITE_NAME} blog`,
    url: `${SITE_URL}/blog`,
    inLanguage: 'nl-NL',
    publisher: PUBLISHER,
    blogPost: posts.map((p) => ({ '@type': 'BlogPosting', headline: p.h1, url: `${SITE_URL}/blog/${p.slug}`, datePublished: p.date })),
  };
}
