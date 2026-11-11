// Keyword-driven copy per subcategory (Dutch source text; English comes from i18n/en.json).
// Keywords come from the NL Semrush research (KD < 26). Pure data: safe to import from client components.
import type { SubCategory } from '@/types/ebike';

export const subSlug = (sub: string) =>
  sub.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/&/g, ' en ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export type SubCopy = { title: string; description: string; h1: string; intro: string };

export const SUB_COPY: Partial<Record<SubCategory, SubCopy>> = {
  Stadsfietsen: {
    title: 'Elektrische stadsfiets kopen',
    description: 'Elektrische stadsfietsen voor woon-werkverkeer en dagelijks gebruik, vaak met lage instap en middenmotor. Vergelijk modellen en adviesprijzen.',
    h1: 'Elektrische stadsfiets kopen',
    intro: 'Een elektrische stadsfiets is gemaakt voor dagelijks gebruik: naar je werk, de winkel of de trein. Veel modellen hebben een lage instap, een middenmotor en ruime accu. Vergelijk hieronder stads e-bikes op motor, accucapaciteit en adviesprijs.',
  },
  Trekkingfietsen: {
    title: 'Elektrische trekkingfiets kopen',
    description: 'Elektrische trekkingfietsen voor lange ritten en stoere tochten, met middenmotor en grote accu. Vergelijk modellen, specificaties en adviesprijzen.',
    h1: 'Elektrische trekkingfiets kopen',
    intro: 'Een elektrische trekkingfiets combineert comfort met bereik. Met een stevig frame, een grote accu en vaak een middenmotor ben je zowel op de weg als op fietspaden klaar voor langere ritten. Vergelijk trekking e-bikes op accucapaciteit, motor en gewicht.',
  },
  'Elektrische mountainbikes': {
    title: 'E-MTB kopen: elektrische mountainbike',
    description: 'Elektrische mountainbikes (e-MTB) met sterke middenmotor en grote accu, van hardtail tot fully. Vergelijk modellen, specificaties en adviesprijzen.',
    h1: 'E-MTB kopen: elektrische mountainbikes',
    intro: 'Met een e-MTB rijd je verder en steiler. Deze elektrische mountainbikes hebben een sterke middenmotor, een grote accu en vering voor ruw terrein, van hardtail tot fully. Vergelijk e-mountainbikes op motor, accu, gewicht en adviesprijs.',
  },
  'Gravel & racefietsen': {
    title: 'Elektrische racefiets en gravel e-bike',
    description: 'Elektrische racefietsen en gravel e-bikes met lichte motor voor sportieve ritten. Vergelijk modellen, gewicht, accu en adviesprijzen.',
    h1: 'Elektrische racefiets en gravel e-bike kopen',
    intro: 'Een elektrische racefiets of gravel e-bike geeft sportieve ondersteuning zonder het gewicht van een stadsfiets. De motoren zijn compact, de accu is vaak geïntegreerd in het frame. Vergelijk modellen op gewicht, accucapaciteit en adviesprijs.',
  },
  Vouwfietsen: {
    title: 'Elektrische vouwfiets kopen',
    description: 'Opvouwbare elektrische fietsen, licht en compact voor trein, auto en kleine woningen. Vergelijk elektrische vouwfietsen op gewicht en prijs.',
    h1: 'Elektrische vouwfiets kopen',
    intro: 'Een opvouwbare elektrische fiets neem je eenvoudig mee in de trein of de auto en past in een kleine woning. Let bij het kiezen op gewicht, wielmaat en accucapaciteit. Vergelijk hieronder elektrische vouwfietsen.',
  },
  Bakfietsen: {
    title: 'Elektrische bakfiets kopen',
    description: 'Elektrische bakfietsen en longtails voor kinderen, boodschappen en vervoer. Vergelijk modellen op motor, accu, laadvermogen en adviesprijs.',
    h1: 'Elektrische bakfiets kopen',
    intro: 'Een elektrische bakfiets of longtail vervoert kinderen, boodschappen en bagage zonder dat je er moe van wordt. De motor helpt bij het optrekken en bij tegenwind. Vergelijk bakfietsen op motor, accucapaciteit en maximaal laadvermogen.',
  },
  'Kinder- & jongerenfietsen': {
    title: 'Elektrische fiets voor kinderen',
    description: 'Elektrische fietsen voor kinderen en jongeren, in kleinere maten. Vergelijk modellen, accu en adviesprijzen en vind een passende e-bike.',
    h1: 'Elektrische fiets voor kinderen en jongeren',
    intro: 'Een elektrische fiets voor kinderen en jongeren heeft een lager frame en kleinere wielen. Let op de toegestane leeftijd, de motorondersteuning en het gewicht. Vergelijk de beschikbare modellen hieronder.',
  },
};

export const CATEGORY_INTRO =
  'Vergelijk nieuwe elektrische fietsen: stads-, trekking-, mountain-, vouw- en bakfietsen, met middenmotor of lichte motor. Filter op merk, motor, accucapaciteit en prijs en bekijk per model de specificaties en adviesprijs.';

/** Link target for a subcategory: its own page, or the landing page where one already exists. */
export const subHref = (sub: string, categorySlug = 'elektrische-fietsen') =>
  sub === 'Speed pedelecs' ? '/speed-pedelecs' : `/categorie/${categorySlug}/${subSlug(sub)}`;
