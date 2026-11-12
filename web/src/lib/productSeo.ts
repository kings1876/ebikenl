// Product <title> and meta description: fixed shape, always within Google's display limits.
import type { Locale } from '@/i18n/config';
import type { Product } from '@/types/ebike';
import { PRODUCTS } from '@/data/catalog';

const fit = (text: string, max: number) => {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, Math.max(cut.lastIndexOf(' '), 10)).replace(/[,\s-]+$/, '');
};

const TYPE_NL: Record<string, string> = { Stadsfietsen: 'elektrische stadsfiets', Trekkingfietsen: 'elektrische trekkingfiets', 'Elektrische mountainbikes': 'elektrische mountainbike (e-MTB)', 'Gravel & racefietsen': 'elektrische racefiets of gravel e-bike', Vouwfietsen: 'elektrische vouwfiets', Bakfietsen: 'elektrische bakfiets', 'Speed pedelecs': 'speed pedelec tot 45 km/u', 'Kinder- & jongerenfietsen': 'elektrische fiets voor kinderen en jongeren' };
const TYPE_EN: Record<string, string> = { Stadsfietsen: 'electric city bike', Trekkingfietsen: 'electric trekking bike', 'Elektrische mountainbikes': 'electric mountain bike (e-MTB)', 'Gravel & racefietsen': 'electric road or gravel bike', Vouwfietsen: 'electric folding bike', Bakfietsen: 'electric cargo bike', 'Speed pedelecs': 'speed pedelec up to 45 km/h', 'Kinder- & jongerenfietsen': 'electric bike for children and teenagers' };

export function productMeta(p: Product, locale: Locale) {
  const en = locale === 'en';
  // a few models exist in two variants under one name: add the model code so titles stay unique
  const sameName = PRODUCTS.filter((x) => x.brand === p.brand && x.model.toLowerCase() === p.model.toLowerCase()).length > 1;
  const name = `${p.brand} ${p.model}${sameName ? ' ' + p.slug.split('-').pop()!.toUpperCase() : ''}`;
  // keep the brand suffix (" | E-BIKE-TEKOOP.NL", 19 chars) only when the whole title still fits in 60
  const base = fit(name, 53);
  const title = en ? `Buy ${base}` : `${base} kopen`;
  const absolute = title.length + 19 > 60;

  const motor = p.motorModel?.replace(/\s*,?\s*\d+\s?Nm/i, '').trim();
  const price = p.price.toLocaleString(en ? 'en-GB' : 'nl-NL');
  const manufacturer = p.priceInfo?.originalCurrency === 'EUR';
  const priceText = en ? `${manufacturer ? 'List price' : 'Indicative price'} €${price}.` : `${manufacturer ? 'Adviesprijs' : 'Indicatieve prijs'} €${price}.`;
  const tail = en ? 'See specifications and photos.' : 'Bekijk specificaties en foto\'s.';
  const optional = [
    (en ? TYPE_EN : TYPE_NL)[p.subCategory],
    motor && (en ? `${motor} motor` : `${motor} motor`),
    p.accuWhNumber && `${p.accuWhNumber} Wh ${en ? 'battery' : 'accu'}`,
    p.gewichtKg && `${String(p.gewichtKg).replace('.', en ? '.' : ',')} kg`,
  ].filter(Boolean) as string[];

  let description = '';
  for (let n = optional.length; n >= 0; n--) {
    const specs = optional.slice(0, n).join(', ');
    description = `${name}${specs ? `: ${specs}` : ''}. ${priceText} ${tail}`;
    if (description.length <= 158) break;
  }
  if (description.length > 158) description = `${fit(name, 90)}. ${priceText} ${tail}`;
  if (description.length < 120) description += en ? ' New, with manufacturer warranty.' : ' Nieuw, met fabrieksgarantie.';
  return { title, absolute, description: fit(description, 158) };
}
