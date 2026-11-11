// Brand-page intro written from the brand's real catalogue data, so every brand page has unique, factual text.
// Pure and client-safe: takes the slim product list.
import type { ProductCardData } from '@/types/ebike';
import type { Locale } from '@/i18n/config';

const TYPE_NL: Record<string, string> = {
  Stadsfietsen: 'stadsfietsen',
  Trekkingfietsen: 'trekkingfietsen',
  'Elektrische mountainbikes': 'elektrische mountainbikes',
  'Gravel & racefietsen': 'gravel- en racefietsen',
  Vouwfietsen: 'vouwfietsen',
  Bakfietsen: 'bakfietsen',
  'Speed pedelecs': 'speed pedelecs',
  'Kinder- & jongerenfietsen': 'kinder- en jongerenfietsen',
};
const TYPE_EN: Record<string, string> = {
  Stadsfietsen: 'city bikes',
  Trekkingfietsen: 'trekking bikes',
  'Elektrische mountainbikes': 'electric mountain bikes',
  'Gravel & racefietsen': 'road and gravel bikes',
  Vouwfietsen: 'folding bikes',
  Bakfietsen: 'cargo bikes',
  'Speed pedelecs': 'speed pedelecs',
  'Kinder- & jongerenfietsen': 'youth bikes',
};

const list = (items: string[], and: string) => (items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} ${and} ${items.at(-1)}`);
const eur = (n: number, locale: Locale) => `€${n.toLocaleString(locale === 'en' ? 'en-GB' : 'nl-NL')}`;

export function brandIntro(brand: string, items: ProductCardData[], locale: Locale): string {
  if (!items.length) return '';
  const en = locale === 'en';
  const prices = items.map((p) => p.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);

  const counts = new Map<string, number>();
  items.forEach((p) => counts.set(p.subCategory, (counts.get(p.subCategory) ?? 0) + 1));
  const types = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([sub]) => (en ? TYPE_EN : TYPE_NL)[sub]).filter(Boolean);

  const motors = [...new Set(items.map((p) => p.motormerk).filter(Boolean))] as string[];
  const n = items.length;

  if (en) {
    const motorPart = motors.length ? ` Motors from ${list(motors.slice(0, 4), 'and')}.` : '';
    return `${brand} electric bikes: ${n} ${n === 1 ? 'model' : 'models'} priced from ${eur(min, locale)}${max > min ? ` to ${eur(max, locale)}` : ''}. The range covers ${list(types, 'and')}.${motorPart}`;
  }
  const motorPart = motors.length ? ` Motoren van ${list(motors.slice(0, 4), 'en')}.` : '';
  return `${brand} elektrische fietsen: ${n} ${n === 1 ? 'model' : 'modellen'} met prijzen vanaf ${eur(min, locale)}${max > min ? ` tot ${eur(max, locale)}` : ''}. Het aanbod bestaat uit ${list(types, 'en')}.${motorPart}`;
}
