// List distinct regex matches in a page. Usage: node grep.mjs <url> <regex> [max]
import { fetchText } from './lib.mjs';
const [, , url, pattern, max = '30'] = process.argv;
const html = await fetchText(url);
const seen = [...new Set([...html.matchAll(new RegExp(pattern, 'gi'))].map((m) => m[0].slice(0, 200)))];
console.log('len', html.length, 'distinct', seen.length);
seen.slice(0, +max).forEach((s) => console.log(' ', s));
