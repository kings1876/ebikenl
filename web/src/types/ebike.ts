export type MainCategory = 
  | 'Elektrische fietsen'
  | "Accu's & opladers"
  | 'Accessoires'
  | 'Onderdelen'
  | 'Service';

export type SubCategory =
  // Elektrische fietsen
  | 'Stadsfietsen'
  | 'Trekkingfietsen'
  | 'Elektrische mountainbikes'
  | 'Gravel & racefietsen'
  | 'Vouwfietsen'
  | 'Bakfietsen'
  | 'Speed pedelecs'
  | 'Kinder- & jongerenfietsen'
  // Accu's & opladers
  | "Accu's"
  | 'Opladers'
  // Accessoires
  | 'Sloten'
  | 'Helmen'
  | 'Tassen & manden'
  | 'Verlichting'
  | 'Spatborden & dragers'
  | 'Kinderzitjes'
  // Onderdelen
  | 'Banden'
  | 'Remmen'
  | 'Kettingen & riemen'
  // Service
  | 'Montage'
  | 'Onderhoudspakket'
  | 'Cadeaubon';

export type Brand =
  | 'Gazelle'
  | 'Batavus'
  | 'Sparta'
  | 'Koga'
  | 'Cortina'
  | 'Union'
  | 'Qwic'
  | 'Stella'
  | 'Cube'
  | 'Giant'
  | 'Trek'
  | 'Specialized'
  | 'Haibike'
  | 'Cannondale'
  | 'Scott'
  | 'Bergamont'
  | 'Kalkhoff'
  | 'Raleigh'
  | 'Riese & Müller'
  | 'Stromer'
  | 'Veloretti'
  | 'Brompton'
  | 'Babboe'
  | 'Urban Arrow'
  | 'Liv';

export type Doelgroep = string;
export type Motorpositie = string;
export type Motormerk = string;
export type Accucapaciteit = string;
export type Actieradius = string;
export type Framemaat = string;
export type Versnelling = string;
export type Aandrijving = string;
export type Remtype = string;
export type Wielmaat = string;
export type GewichtKlasse = string;
export type Kleur = string;
export type MaximaleSnelheid = string;
export type Opvouwbaar = string;
export type Leverbaarheid = string;
export type MaxGebruikersgewicht = string;

export type ProductTag =
  | 'Woon-werkverkeer'
  | 'Recreatief'
  | 'Gezinsfiets'
  | 'Sportief'
  | 'Senioren'
  | 'Beginners'
  | 'Lichtgewicht'
  | 'Lage instap'
  | 'Fietsplan geschikt'
  | 'Direct leverbaar'
  | 'Nieuw'
  | 'Aanbieding'
  | 'Bestseller';

export interface TrustpilotReview {
  id: string;
  author: string;
  city: string;
  rating?: number; // 1-5
  date: string;
  title: string;
  content: string;
  verified: boolean;
  productTitle?: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string; // SEO rule: Merk Model, motormerk, accu Wh, framevorm
  brand: Brand;
  model: string;
  category: MainCategory;
  subCategory: SubCategory;
  price: number; // in EUR incl 21% BTW (imported products always carry a sourced price, see priceInfo)
  originalPrice?: number;
  image: string;
  galleryImages: string[];
  description: string;
  shortDescription: string;
  
  // Attributes (filters)
  doelgroep?: Doelgroep;
  motorpositie?: Motorpositie;
  motormerk?: Motormerk;
  motorModel?: string;
  motorTorqueNm?: number;
  accucapaciteit?: Accucapaciteit;
  accuWhNumber?: number;
  actieradius?: Actieradius;
  framematen?: Framemaat[];
  versnelling?: Versnelling;
  versnellingDetail?: string;
  aandrijving?: Aandrijving;
  remtype?: Remtype;
  wielmaat?: Wielmaat;
  gewichtKlasse?: GewichtKlasse;
  gewichtKg?: number;
  kleuren?: Kleur[];
  maximaleSnelheid?: MaximaleSnelheid;
  opvouwbaar?: Opvouwbaar;
  leverbaarheid?: Leverbaarheid;
  maxGebruikersgewicht?: MaxGebruikersgewicht;
  
  // Tags
  tags: ProductTag[];
  
  // Product-level fields
  ean?: string;
  sku?: string;
  warranty?: {
    frame: string;
    battery: string;
    motor: string;
  };
  en15194Certified?: boolean;
  speedPedelecRequirements?: {
    licensePlateRequired: boolean;
    helmetRequired: boolean;
    drivingLicense: string;
  };
  shipping?: {
    weightKg: number;
    boxDimensions: string;
    assembledDeliveryAvailable: boolean;
    assembledDeliveryIncluded: boolean;
  };

  // Provenance (imported catalogue)
  source?: { brandUrl: string; retrieved: string };
  priceInfo?: { source: string; retrieved: string; originalAmount?: number; originalCurrency?: string; fxRate?: number; note?: string };
  specs?: Record<string, string>;

  // Trustpilot stats
  reviews: TrustpilotReview[];
  rating?: number;
  reviewCount?: number;
}

export interface FilterState {
  search: string;
  category: MainCategory | 'Alle';
  subCategory: SubCategory | 'Alle';
  brands: Brand[];
  doelgroep: Doelgroep[];
  motorpositie: Motorpositie[];
  motormerk: Motormerk[];
  accucapaciteit: Accucapaciteit[];
  actieradius: Actieradius[];
  framemaat: Framemaat[];
  versnelling: Versnelling[];
  aandrijving: Aandrijving[];
  remtype: Remtype[];
  wielmaat: Wielmaat[];
  gewichtKlasse: GewichtKlasse[];
  kleur: Kleur[];
  maximaleSnelheid: MaximaleSnelheid[];
  leverbaarheid: Leverbaarheid[];
  tags: ProductTag[];
  maxPrice: number;
  minPrice: number;
  sortBy: 'populariteit' | 'prijs-laag-hoog' | 'prijs-hoog-laag' | 'nieuw' | 'beoordeling';
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedFramemaat: Framemaat;
  selectedKleur: Kleur;
  assemblyOption: '100% Rijklaar thuisbezorgd' | 'In fabrieksdoos (90% gemonteerd)';
}
