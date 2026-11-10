import catalogData from './catalog.json';
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
  'Brompton', 'Babboe', 'Urban Arrow', 'Liv', 'Tenways', 'Ghost', 'Sushi Bikes', 'Winora'
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

// Imported from the manufacturers' own product pages (see scripts/import). Never edit by hand.
export const PRODUCTS: Product[] = catalogData as unknown as Product[];

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
    subtitle: 'Krachtig, betrouwbaar en stil. De nummer 1 motorkeuze in Nederland.',
    h1: 'Elektrische Fietsen met Bosch Middenmotor',
    metaTitle: 'Bosch Middenmotor E-bike Kopen | E-BIKE-TEKOOP.NL',
    metaDescription: 'Bekijk ons ruime assortiment elektrische fietsen met Bosch Performance, Cargo en Active Line middenmotor. Direct uit voorraad leverbaar met fabrieksgarantie.',
    matchFilter: { motormerk: 'Bosch', motorpositie: 'Middenmotor' },
    highlightPoints: [
      'Stille en natuurlijke trapondersteuning met 3-sensor technologie',
      'Actieradius tot 180 km met 750 Wh PowerTube accu',
      'Compatibel met Bosch Smart System en eBike Flow app'
    ]
  },
  {
    id: 'landing-damesfietsen',
    slug: 'elektrische-damesfiets',
    title: 'Elektrische Damesfietsen',
    subtitle: 'Comfortabele lage instap, stabiel frame en veilige balans.',
    h1: 'Elektrische Damesfiets met Lage Instap Kopen',
    metaTitle: 'Elektrische Damesfiets Kopen | Lage Instap | E-BIKE-TEKOOP.NL',
    metaDescription: 'Vind de ideale elektrische damesfiets met lage instap van topmerken als Gazelle, Batavus en Koga. 100% rijklaar bezorgd aan huis.',
    matchFilter: { doelgroep: 'Dames (lage instap)' },
    highlightPoints: [
      'Moeiteloos op- en afstappen door ruime lage instap',
      'Rechtop zittende comfortabele fietshouding',
      'Ideaal voor boodschappen, toertochten en woon-werkverkeer'
    ]
  },
  {
    id: 'landing-onder-2000',
    slug: 'e-bike-onder-2000',
    title: 'E-bike onder €2000',
    subtitle: 'Kwaliteit en A-merk garantie binnen een toegankelijk budget.',
    h1: 'Nieuwe Elektrische Fietsen onder de €2.000,-',
    metaTitle: 'Elektrische Fiets onder €2000 | Aanbiedingen | E-BIKE-TEKOOP.NL',
    metaDescription: 'Betaalbare nieuwe A-merk e-bikes onder €2.000 met volle fabrieksgarantie. Betaal eenvoudig met iDEAL, bankoverschrijving of crypto.',
    matchFilter: {},
    priceMax: 2000,
    highlightPoints: [
      'Inclusief 2 jaar volledige fabrieksgarantie op accu en motor',
      'Prijzen inclusief 21% BTW en rijklaar afmontage',
      'Gunstig te verrekenen via het zakelijk fietsplan (WKR)'
    ]
  },
  {
    id: 'landing-fietsplan',
    slug: 'fietsplan-e-bikes',
    title: 'Fietsplan & WKR E-bikes',
    subtitle: 'Tot 40% fiscaal voordeel via je werkgever met het Nationaal Fietsplan.',
    h1: 'E-bike via het Fietsplan (WKR) van je Werkgever',
    metaTitle: 'E-bike via Fietsplan Kopen | Tot 40% Belastingvoordeel | E-BIKE-TEKOOP.NL',
    metaDescription: 'Koop een nieuwe elektrische fiets met belastingvoordeel via je werkgever. E-BIKE-TEKOOP.NL levert officiële WKR-facturen en FiscFree / Hellorider ondersteuning.',
    matchFilter: {},
    highlightPoints: [
      'Betaal vanuit je brutoloon en bespaar tot 40% op de aankoopprijs',
      'Direct geldige WKR-factuur met uitsplitsing van accessoires en slot',
      'Geschikt voor alle bekende leasemaatschappijen en fietsplanplatforms'
    ]
  },
  {
    id: 'landing-speed-pedelecs',
    slug: 'speed-pedelecs',
    title: 'Speed Pedelecs (45 km/u)',
    subtitle: 'Snel, emissievrij forenzen. Het slimme alternatief voor de file.',
    h1: 'Speed Pedelec 45 km/u Kopen | Direct met Kenteken',
    metaTitle: 'Speed Pedelecs 45 km/u | Stromer & Riese Müller | E-BIKE-TEKOOP.NL',
    metaDescription: 'Ervaar ultieme snelheid met onze 45 km/u speed pedelecs van Stromer en Riese & Müller. Inclusief kentekenregistratie en RDW-keuring.',
    matchFilter: { maximaleSnelheid: '45 km/u' },
    highlightPoints: [
      'RDW-geregistreerd geel bromfietskenteken door ons verzorgd',
      'Accu’s tot 1000Wh voor bereik van meer dan 100 km bij 45 km/u',
      'Onderhoudsvrije Gates riemaandrijving en Pinion / Enviolo naven'
    ]
  }
];
