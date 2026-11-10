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
  | 'Urban Arrow';

export type Doelgroep = 'Dames (lage instap)' | 'Heren (diamant)' | 'Unisex (middeninstap)' | 'Kinderen';
export type Motorpositie = 'Middenmotor' | 'Voorwielmotor' | 'Achterwielmotor';
export type Motormerk = 'Bosch' | 'Shimano STEPS' | 'Yamaha' | 'Brose' | 'Fazua' | 'Bafang';
export type Accucapaciteit = '400 Wh' | '500 Wh' | '625 Wh' | '750 Wh' | '1000 Wh of meer';
export type Actieradius = 'Tot 60 km' | '60-100 km' | '100-150 km' | '150 km of meer';
export type Framemaat = '46 cm' | '50 cm' | '53 cm' | '56 cm' | '59 cm' | '61 cm';
export type Versnelling = 'Naafschakeling' | 'Derailleur' | 'Stepless (Enviolo)' | 'Single speed';
export type Aandrijving = 'Ketting' | 'Riem';
export type Remtype = 'Rollerbrake' | 'V-brake' | 'Schijfrem' | 'Hydraulische schijfrem';
export type Wielmaat = '20 inch' | '24 inch' | '26 inch' | '27,5 inch' | '28 inch' | '29 inch';
export type GewichtKlasse = 'Onder 20 kg' | '20-25 kg' | 'Meer dan 25 kg';
export type Kleur = 'Zwart' | 'Wit' | 'Grijs' | 'Blauw' | 'Groen' | 'Rood' | 'Beige' | 'Overig';
export type MaximaleSnelheid = '25 km/u' | '45 km/u';
export type Opvouwbaar = 'Ja' | 'Nee';
export type Leverbaarheid = 'Op voorraad' | '3-5 werkdagen' | '2-4 weken' | 'Op bestelling';
export type MaxGebruikersgewicht = '120 kg' | '130 kg' | '150 kg';

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
  rating: number; // 1-5
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
  price: number; // in EUR incl 21% BTW
  originalPrice?: number;
  image: string;
  galleryImages: string[];
  description: string;
  shortDescription: string;
  
  // Attributes (filters)
  doelgroep: Doelgroep;
  motorpositie: Motorpositie;
  motormerk: Motormerk;
  motorModel: string;
  motorTorqueNm: number;
  accucapaciteit: Accucapaciteit;
  accuWhNumber: number;
  actieradius: Actieradius;
  framematen: Framemaat[];
  versnelling: Versnelling;
  versnellingDetail: string;
  aandrijving: Aandrijving;
  remtype: Remtype;
  wielmaat: Wielmaat;
  gewichtKlasse: GewichtKlasse;
  gewichtKg: number;
  kleuren: Kleur[];
  maximaleSnelheid: MaximaleSnelheid;
  opvouwbaar: Opvouwbaar;
  leverbaarheid: Leverbaarheid;
  maxGebruikersgewicht: MaxGebruikersgewicht;
  
  // Tags
  tags: ProductTag[];
  
  // Product-level fields
  ean: string;
  sku: string;
  warranty: {
    frame: string;
    battery: string;
    motor: string;
  };
  en15194Certified: boolean;
  speedPedelecRequirements?: {
    licensePlateRequired: boolean;
    helmetRequired: boolean;
    drivingLicense: string;
  };
  shipping: {
    weightKg: number;
    boxDimensions: string;
    assembledDeliveryAvailable: boolean;
    assembledDeliveryIncluded: boolean;
  };

  // Trustpilot stats
  reviews: TrustpilotReview[];
  rating: number;
  reviewCount: number;
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
