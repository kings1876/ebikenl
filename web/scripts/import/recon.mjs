// Print context around a regex match in a page (for working out a site's markup). Usage: node recon.mjs <url> <regex> [before] [after]
import { fetchText } from './lib.mjs';
const [, , url, pattern, before = '600', after = '400'] = process.argv;
const html = await fetchText(url);
const m = new RegExp(pattern, 'i').exec(html);
console.log('len', html.length, '| match', m ? m.index : 'none');
if (m) console.log(html.slice(Math.max(0, m.index - +before), m.index + +after).replace(/\s+/g, ' '));
