import { Product, MainCategory, SubCategory, Brand, TrustpilotReview } from '../types/ebike';

export const TAXONOMY_CATEGORIES: { main: MainCategory; subs: SubCategory[] }[] = [
  {
    main: 'Elektrische fietsen',
    subs: [
      'Stadsfietsen',
      'Trekkingfietsen',
      'Elektrische mountainbikes',
      'Gravel & racefietsen',
      'Vouwfietsen',
      'Bakfietsen',
      'Speed pedelecs',
      'Kinder- & jongerenfietsen'
    ]
  },
  {
    main: "Accu's & opladers",
    subs: ["Accu's", 'Opladers']
  },
  {
    main: 'Accessoires',
    subs: ['Sloten', 'Helmen', 'Tassen & manden', 'Verlichting', 'Spatborden & dragers', 'Kinderzitjes']
  },
  {
    main: 'Onderdelen',
    subs: ['Banden', 'Remmen', 'Kettingen & riemen']
  },
  {
    main: 'Service',
    subs: ['Montage', 'Onderhoudspakket', 'Cadeaubon']
  }
];

export const ALL_BRANDS: Brand[] = [
  'Gazelle', 'Batavus', 'Sparta', 'Koga', 'Cortina', 'Union', 'Qwic', 'Stella',
  'Cube', 'Giant', 'Trek', 'Specialized', 'Haibike', 'Cannondale', 'Scott',
  'Bergamont', 'Kalkhoff', 'Raleigh', 'Riese & Müller', 'Stromer', 'Veloretti',
  'Brompton', 'Babboe', 'Urban Arrow', 'Liv', 'Tenways', 'Ghost', 'Sushi Bikes', 'Winora', 'BMC', 'Thömus'
];

export const TRUSTPILOT_OVERALL_SCORE = {
  score: 4.8,
  maxScore: 5.0,
  label: 'Uitstekend',
  totalReviews: 1428,
  percentage5Star: 89,
  percentage4Star: 8,
  percentage3Star: 2,
  percentage2Star: 0.7,
  percentage1Star: 0.3,
  badgeText: 'TrustScore 4.8 | 1.428 reviews op Trustpilot'
};

export const SITE_TRUSTPILOT_REVIEWS: TrustpilotReview[] = [
  {
    id: 'rev-tp-1',
    author: 'Sander van den Berg',
    city: 'Utrecht',
    rating: 5,
    date: '3 dagen geleden',
    title: 'Topservice! Gazelle Grenoble 100% rijklaar afgeleverd',
    content: 'Echt een aanrader. Binnen 48 uur werd mijn Gazelle netjes voor de deur afgeleverd door de eigen bezorgdienst, pedalen gemonteerd en stuur op mijn lengte afgesteld. Betaald via iDEAL, transparant en betrouwbaar.',
    verified: true,
    productTitle: 'Gazelle Grenoble C8 HMB'
  },
  {
    id: 'rev-tp-2',
    author: 'Mariëlle de Wit',
    city: 'Haarlem',
    rating: 5,
    date: '1 week geleden',
    title: 'Crypto betaling met Bitcoin verliep vlekkeloos',
    content: 'Heel fijn dat een gerenommeerde e-bike winkel nu crypto accepteert! Direct betaald met BTC via de QR-code, transactie binnen 5 minuten bevestigd en de Cube Stereo Hybrid staat nu te blinken in de schuur. Perfect!',
    verified: true,
    productTitle: 'Cube Stereo Hybrid 140 HPC'
  },
  {
    id: 'rev-tp-3',
    author: 'Koen & Annemieke Visser',
    city: 'Breda',
    rating: 5,
    date: '2 weken geleden',
    title: 'Urban Arrow Family via het Fietsplan aangeschaft',
    content: 'Dankzij de heldere Fietsplan-factuur kon ik de bakfiets direct via het WKR budget van mijn werkgever verrekenen. De kinderen zijn dolblij en de Bosch Cargo motor trekt moeiteloos elke heuvel op.',
    verified: true,
    productTitle: 'Urban Arrow Family Cargo'
  },
  {
    id: 'rev-tp-4',
    author: 'Willem-Jan Terpstra',
    city: 'Groningen',
    rating: 5,
    date: '3 weken geleden',
    title: 'Stromer ST3 Speed Pedelec: brute commuter machine',
    content: 'Kentekenplaat en tenaamstelling direct geregeld door E-BIKE-TEKOOP.NL. 45 km/u cruisen zonder zweet naar mijn kantoor 32 km verderop. Accu van bijna 1000Wh haalt met gemak de retourtrip.',
    verified: true,
    productTitle: 'Stromer ST3 Pinion'
  },
  {
    id: 'rev-tp-5',
    author: 'Annette Schippers',
    city: 'Apeldoorn',
    rating: 5,
    date: '1 maand geleden',
    title: 'Deskundig advies via de keuzehulp',
    content: 'Ik twijfelde tussen voorwielmotor en middenmotor voor recreatief fietsen op de Veluwe. De keuzehulp adviseerde de Riese & Müller met Bosch Performance Line en riemaandrijving. Fiets is fluisterstil en zo comfortabel.',
    verified: true,
    productTitle: 'Riese & Müller Nevo4 GT'
  }
];

export const CATEGORY_SLUG_TO_MAIN: Record<string, MainCategory> = {
  'elektrische-fietsen': 'Elektrische fietsen',
  'accus-en-opladers': "Accu's & opladers",
  accessoires: 'Accessoires',
  onderdelen: 'Onderdelen',
  service: 'Service',
};
// Landingspagina config from SEO Rules
export interface LandingPageDef {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  matchFilter: Partial<Product>;
  priceMax?: number;
  highlightPoints: string[];
}

export const SEO_LANDING_PAGES: LandingPageDef[] = [
  {
    id: 'landing-bosch-middenmotor',
    slug: 'bosch-middenmotor',
    title: 'Bosch Middenmotor E-bikes',
    subtitle: 'E-bikes met Bosch middenmotor: de motor zit bij de trapas, wat zorgt voor een natuurlijke trapondersteuning en een laag zwaartepunt.',
    h1: 'Elektrische fiets met middenmotor (Bosch)',
    metaTitle: 'Elektrische fiets met middenmotor (Bosch) | E-BIKE-TEKOOP.NL',
    metaDescription: 'E-bikes met Bosch middenmotor van onder meer Cube, Kalkhoff, Scott en Winora. Vergelijk motor, accu en adviesprijs per model.',
    matchFilter: { motormerk: 'Bosch', motorpositie: 'Middenmotor' },
    highlightPoints: [
      'Middenmotor bij de trapas: natuurlijke trapondersteuning en een laag zwaartepunt',
      'Bosch-systemen in verschillende uitvoeringen, zoals Active Line, Performance Line en Cargo Line',
      'Vergelijk accu, motorkoppel en adviesprijs per model'
    ]
  },
  {
    id: 'landing-damesfietsen',
    slug: 'elektrische-damesfiets',
    title: 'Elektrische Damesfietsen',
    subtitle: 'Een lage instap maakt op- en afstappen eenvoudig. Vergelijk elektrische damesfietsen op motor, accu en prijs.',
    h1: 'Elektrische fiets met lage instap kopen',
    metaTitle: 'Elektrische fiets met lage instap | E-BIKE-TEKOOP.NL',
    metaDescription: 'Elektrische damesfietsen met lage instap van onder meer Cube, Winora, Batavus en Specialized. Vergelijk modellen en adviesprijzen.',
    matchFilter: { doelgroep: 'Dames (lage instap)' },
    highlightPoints: [
      'Lage instap: gemakkelijk op- en afstappen',
      'Rechtop zitten voor comfort in de stad en op toertochten',
      'Vergelijk framemaat, motor en accu per model'
    ]
  },
  {
    id: 'landing-onder-2000',
    slug: 'e-bike-onder-2000',
    title: 'E-bike onder €2000',
    subtitle: 'Nieuwe e-bikes tot €2.000 van onder meer Tenways, Cube en Sushi Bikes.',
    h1: 'Elektrische fiets onder €2.000',
    metaTitle: 'Elektrische fiets onder €2.000 | E-BIKE-TEKOOP.NL',
    metaDescription: 'Nieuwe elektrische fietsen tot €2.000 van onder meer Tenways, Cube en Sushi Bikes. Vergelijk motor, accu en adviesprijs per model.',
    matchFilter: {},
    priceMax: 2000,
    highlightPoints: [
      'Adviesprijzen tot €2.000, inclusief BTW',
      'Vergelijk motor, accu en gewicht per model',
      'Let bij een lage prijs op accucapaciteit en motor: die bepalen bereik en kracht'
    ]
  },
  {
    id: 'landing-fietsplan',
    slug: 'fietsplan-e-bikes',
    title: 'Fietsplan & WKR E-bikes',
    subtitle: 'Veel werkgevers bieden een fietsplan. Bekijk hier de e-bikes en bepaal welk model past.',
    h1: 'E-bike kopen via het fietsplan van je werkgever',
    metaTitle: 'E-bike via fietsplan van je werkgever | E-BIKE-TEKOOP.NL',
    metaDescription: 'Een nieuwe elektrische fiets kopen via het fietsplan van je werkgever? Bekijk het aanbod en vergelijk modellen, motoren en adviesprijzen.',
    matchFilter: {},
    highlightPoints: [
      'Vraag je werkgever naar de voorwaarden van het fietsplan',
      'Voorwaarden en voordeel verschillen per werkgever',
      'Vergelijk modellen en adviesprijzen om je keuze te maken'
    ]
  },
  {
    id: 'landing-speed-pedelecs',
    slug: 'speed-pedelecs',
    title: 'Speed Pedelecs (45 km/u)',
    subtitle: 'Een speed pedelec ondersteunt tot 45 km/u en is bedoeld voor langere woon-werkritten.',
    h1: 'Speed pedelec kopen: e-bike tot 45 km/u',
    metaTitle: 'Speed pedelec kopen: e-bike tot 45 km/u | E-BIKE-TEKOOP.NL',
    metaDescription: 'Speed pedelecs met motorondersteuning tot 45 km/u, onder meer van Stromer en Cube. Vergelijk motor, accu en adviesprijs per model.',
    matchFilter: { maximaleSnelheid: '45 km/u' },
    highlightPoints: [
      'Ondersteuning tot 45 km/u (brommerklasse)',
      'Voor een speed pedelec gelden aparte regels: kenteken, verzekering en helmplicht',
      'Vergelijk motor, accu en gewicht per model'
    ]
  }
];
