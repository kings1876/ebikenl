// Blog content loader. Posts are Markdown files in /content/blog with a small frontmatter block.
// Server-only (reads the file system at build time); the pages are fully static.
import fs from 'node:fs';
import path from 'node:path';

export type PostType = 'transactional' | 'commercial' | 'informational';

export interface PostMeta {
  slug: string;
  /** SEO title, 50-60 characters, shown as the <title> (no site suffix). */
  title: string;
  h1: string;
  description: string;
  /** Primary keyword the post targets. */
  keyword: string;
  type: PostType;
  date: string;
  updated: string;
  image: string;
  imageAlt: string;
  /** Catalogue product slugs shown as cards under the article. */
  products: string[];
  /** Category / landing page the post leads to ("Bekijk alle ..."). */
  category: string;
  categoryLabel: string;
  related: string[];
}

export interface Post extends PostMeta {
  body: string;
  words: number;
  readingMinutes: number;
}

const DIR = path.join(process.cwd(), 'content', 'blog');

export const TYPE_LABEL: Record<PostType, string> = {
  transactional: 'Koopgids',
  commercial: 'Vergelijking',
  informational: 'Uitleg',
};

const list = (v: string | undefined) => (v ? v.split(',').map((s) => s.trim()).filter(Boolean) : []);

/** Words in the readable text: markdown syntax, image lines and link URLs are not counted. */
export function countWords(markdown: string): number {
  const text = markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[\[(?:picks|cta)\]\]/g, ' ')
    .replace(/[#>*_`|]/g, ' ')
    .replace(/^\s*[-:]+\s*$/gm, ' ');
  return text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}

function parse(file: string): Post {
  const raw = fs.readFileSync(path.join(DIR, file), 'utf8').replace(/\r\n/g, '\n');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`blog: missing frontmatter in ${file}`);
  const fm: Record<string, string> = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) fm[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"(.*)"$/, '$1');
  }
  const need = ['title', 'h1', 'description', 'keyword', 'type', 'date', 'image', 'imageAlt', 'category', 'categoryLabel'];
  for (const k of need) if (!fm[k]) throw new Error(`blog: ${file} is missing "${k}"`);
  const body = m[2].trim();
  const words = countWords(body);
  return {
    slug: file.replace(/\.md$/, ''),
    title: fm.title,
    h1: fm.h1,
    description: fm.description,
    keyword: fm.keyword,
    type: fm.type as PostType,
    date: fm.date,
    updated: fm.updated || fm.date,
    image: fm.image,
    imageAlt: fm.imageAlt,
    products: list(fm.products),
    category: fm.category,
    categoryLabel: fm.categoryLabel,
    related: list(fm.related),
    body,
    words,
    readingMinutes: Math.max(1, Math.round(words / 200)),
  };
}

let cache: Post[] | undefined;

export function getAllPosts(): Post[] {
  if (cache) return cache;
  const files = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => f.endsWith('.md')) : [];
  cache = files.map(parse).sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
  return cache;
}

export const getPost = (slug: string) => getAllPosts().find((p) => p.slug === slug);
