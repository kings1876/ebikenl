// Minimal Markdown renderer for blog posts (server component). Supports: ## / ### headings, paragraphs, bullet and numbered
// lists, blockquotes, pipe tables, images with optional caption, **bold**, *italic*, [links](url) and the [[picks]] marker.
import fs from 'node:fs';
import path from 'node:path';
import Link from 'next/link';
import sharp from 'sharp';
import type { ReactNode } from 'react';

export interface Heading {
  id: string;
  text: string;
}

export const slugify = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const isExternal = (href: string) => /^https?:\/\//i.test(href);

/** Inline formatting: links, bold, italic. Internal links use next/link, external ones open in a new tab with rel=noopener. */
function inline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*\s][^*]*)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let n = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const key = `${keyBase}-${n++}`;
    if (m[1] !== undefined) {
      const href = m[2];
      out.push(
        isExternal(href) ? (
          <a key={key} href={href} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-900">
            {m[1]}
          </a>
        ) : (
          <Link key={key} href={href} className="font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-900">
            {m[1]}
          </Link>
        ),
      );
    } else if (m[3] !== undefined) {
      out.push(<strong key={key} className="font-bold text-slate-900">{m[3]}</strong>);
    } else {
      out.push(<em key={key}>{m[4]}</em>);
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

async function imageSize(src: string): Promise<{ width: number; height: number } | null> {
  try {
    const meta = await sharp(fs.readFileSync(path.join(process.cwd(), 'public', src))).metadata();
    return meta.width && meta.height ? { width: meta.width, height: meta.height } : null;
  } catch {
    return null;
  }
}

export interface Rendered {
  nodes: ReactNode[];
  headings: Heading[];
}

/** `picks` is rendered where the [[picks]] marker stands (or appended by the caller when the marker is absent). */
export async function renderMarkdown(body: string, picks: ReactNode, opts: { firstImageEager?: boolean } = {}): Promise<Rendered> {
  const lines = body.replace(/\r\n/g, '\n').split('\n');
  const nodes: ReactNode[] = [];
  const headings: Heading[] = [];
  let i = 0;
  let key = 0;
  let eager = opts.firstImageEager ?? false;
  const k = () => `b${key++}`;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }

    if (line.trim() === '[[picks]]') { nodes.push(<div key={k()}>{picks}</div>); i++; continue; }

    const h = line.match(/^(#{2,3})\s+(.*)$/);
    if (h) {
      const text = h[2].trim();
      const id = slugify(text);
      if (h[1] === '##') {
        headings.push({ id, text });
        nodes.push(<h2 key={k()} id={id} className="mt-12 mb-4 scroll-mt-24 font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{inline(text, id)}</h2>);
      } else {
        nodes.push(<h3 key={k()} id={id} className="mt-8 mb-3 scroll-mt-24 font-display text-xl font-bold text-slate-900">{inline(text, id)}</h3>);
      }
      i++;
      continue;
    }

    const img = line.match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)\s*$/);
    if (img) {
      const [, alt, src, caption] = img;
      const size = await imageSize(src);
      const loading = eager ? 'eager' : 'lazy';
      eager = false;
      nodes.push(
        <figure key={k()} className="my-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} width={size?.width} height={size?.height} loading={loading} decoding="async" className="w-full rounded-2xl border border-slate-200 bg-white object-contain" style={{ aspectRatio: size ? `${size.width} / ${size.height}` : '4 / 3' }} />
          {caption && <figcaption className="mt-2 text-center text-xs text-slate-500">{caption}</figcaption>}
        </figure>,
      );
      i++;
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*[-*]\s+/, ''));
      nodes.push(<ul key={k()} className="my-5 list-disc space-y-2 pl-6 text-slate-700 marker:text-blue-600">{items.map((t, j) => <li key={j}>{inline(t, `li${key}-${j}`)}</li>)}</ul>);
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*\d+\.\s+/, ''));
      nodes.push(<ol key={k()} className="my-5 list-decimal space-y-2 pl-6 text-slate-700 marker:font-bold marker:text-blue-600">{items.map((t, j) => <li key={j}>{inline(t, `ol${key}-${j}`)}</li>)}</ol>);
      continue;
    }

    if (line.startsWith('>')) {
      const parts: string[] = [];
      while (i < lines.length && lines[i].startsWith('>')) parts.push(lines[i++].replace(/^>\s?/, ''));
      nodes.push(<blockquote key={k()} className="my-6 rounded-r-xl border-l-4 border-blue-600 bg-blue-50 px-5 py-4 text-slate-800">{inline(parts.join(' '), `bq${key}`)}</blockquote>);
      continue;
    }

    if (line.includes('|') && lines[i + 1]?.match(/^\s*\|?\s*:?-{2,}/)) {
      const rows: string[][] = [];
      const cells = (l: string) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      const head = cells(lines[i]);
      i += 2;
      while (i < lines.length && lines[i].includes('|')) rows.push(cells(lines[i++]));
      nodes.push(
        <div key={k()} className="my-6 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>{head.map((c, j) => <th key={j} scope="col" className="px-4 py-3 font-bold">{inline(c, `th${key}-${j}`)}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {rows.map((r, j) => <tr key={j}>{r.map((c, x) => <td key={x} className="px-4 py-3 align-top text-slate-700">{inline(c, `td${key}-${j}-${x}`)}</td>)}</tr>)}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{2,3}\s|!\[|\s*[-*]\s|\s*\d+\.\s|>|\[\[picks\]\])/.test(lines[i]) && !(lines[i].includes('|') && lines[i + 1]?.match(/^\s*\|?\s*:?-{2,}/))) para.push(lines[i++]);
    if (!para.length) para.push(lines[i++]); // safety: a line no block rule recognises is rendered as text, never loops
    nodes.push(<p key={k()} className="my-5 text-[17px] leading-8 text-slate-700">{inline(para.join(' '), `p${key}`)}</p>);
  }

  return { nodes, headings };
}
