import React, { useState } from 'react';
import { TAXONOMY_CATEGORIES, ALL_BRANDS } from '../data/ebikes';
import { X, Layers, Tag, Filter, CheckCircle, Database, Globe, Search, ShieldCheck } from 'lucide-react';

interface TaxonomyExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TaxonomyExplorerModal: React.FC<TaxonomyExplorerModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'categories' | 'brands' | 'attributes' | 'tags' | 'fields' | 'seo'>('categories');

  const ATTRIBUTES_DEFINITIONS = [
    { name: 'Doelgroep', slug: 'pa_doelgroep', terms: ['Dames (lage instap)', 'Heren (diamant)', 'Unisex (middeninstap)', 'Kinderen'] },
    { name: 'Motorpositie', slug: 'pa_motorpositie', terms: ['Middenmotor', 'Voorwielmotor', 'Achterwielmotor'] },
    { name: 'Motormerk', slug: 'pa_motormerk', terms: ['Bosch', 'Shimano STEPS', 'Yamaha', 'Brose', 'Fazua', 'Bafang'] },
    { name: 'Accucapaciteit', slug: 'pa_accucapaciteit', terms: ['400 Wh', '500 Wh', '625 Wh', '750 Wh', '1000 Wh of meer'] },
    { name: 'Actieradius', slug: 'pa_actieradius', terms: ['Tot 60 km', '60-100 km', '100-150 km', '150 km of meer'] },
    { name: 'Framemaat', slug: 'pa_framemaat', terms: ['46 cm', '50 cm', '53 cm', '56 cm', '59 cm', '61 cm'] },
    { name: 'Versnelling', slug: 'pa_versnelling', terms: ['Naafschakeling', 'Derailleur', 'Stepless (Enviolo)', 'Single speed'] },
    { name: 'Aandrijving', slug: 'pa_aandrijving', terms: ['Ketting', 'Riem'] },
    { name: 'Remtype', slug: 'pa_remtype', terms: ['Rollerbrake', 'V-brake', 'Schijfrem', 'Hydraulische schijfrem'] },
    { name: 'Wielmaat', slug: 'pa_wielmaat', terms: ['20 inch', '24 inch', '26 inch', '27,5 inch', '28 inch', '29 inch'] },
    { name: 'Gewicht', slug: 'pa_gewicht', terms: ['Onder 20 kg', '20-25 kg', 'Meer dan 25 kg'] },
    { name: 'Kleur', slug: 'pa_kleur', terms: ['Zwart', 'Wit', 'Grijs', 'Blauw', 'Groen', 'Rood', 'Beige', 'Overig'] },
    { name: 'Maximale snelheid', slug: 'pa_max_snelheid', terms: ['25 km/u', '45 km/u'] },
    { name: 'Opvouwbaar', slug: 'pa_opvouwbaar', terms: ['Ja', 'Nee'] },
    { name: 'Leverbaarheid', slug: 'pa_leverbaarheid', terms: ['Op voorraad', '3-5 werkdagen', '2-4 weken', 'Op bestelling'] },
    { name: 'Max. gebruikersgewicht', slug: 'pa_max_gewicht', terms: ['120 kg', '130 kg', '150 kg'] }
  ];

  const TAGS_LIST = [
    'Woon-werkverkeer', 'Recreatief', 'Gezinsfiets', 'Sportief', 'Senioren', 'Beginners',
    'Lichtgewicht', 'Lage instap', 'Fietsplan geschikt', 'Direct leverbaar', 'Nieuw',
    'Aanbieding', 'Bestseller'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">
                E-BIKE-TEKOOP.NL Architectuur & Taxonomie
              </h2>
              <p className="text-xs text-slate-500">
                Distributeur WooCommerce specificatie & SEO structuur
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-200 bg-slate-50/50 overflow-x-auto text-xs font-semibold">
          {[
            { key: 'categories', label: '1. Categorieën' },
            { key: 'brands', label: '2. Merken (24 A-Merken)' },
            { key: 'attributes', label: '3. Attributen (16 Filters)' },
            { key: 'tags', label: '4. Tags' },
            { key: 'fields', label: '5. Product-Level Fields' },
            { key: 'seo', label: '6. SEO & Site Settings' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`pb-3 px-3 transition-colors border-b-2 -mb-px whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          {/* 1. Categories */}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/60 text-blue-900">
                Hiërarchische boomstructuur voor de WooCommerce productcategorieën:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TAXONOMY_CATEGORIES.map((cat) => (
                  <div key={cat.main} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      <span>{cat.main}</span>
                    </div>
                    <ul className="space-y-1.5 pl-4 border-l-2 border-slate-200 text-slate-600">
                      {cat.subs.map((sub) => (
                        <li key={sub} className="flex items-center gap-2">
                          <span className="text-slate-300">└─</span>
                          <span className="font-medium">{sub}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Brands */}
          {activeTab === 'brands' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700">
                Officiële A-merken via distributeur (native WooCommerce Brands taxonomie):
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {ALL_BRANDS.map((brand) => (
                  <div
                    key={brand}
                    className="p-3 bg-white rounded-lg border border-slate-200 text-center font-bold text-slate-800 shadow-2xs hover:border-blue-500 transition-colors"
                  >
                    {brand}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Attributes */}
          {activeTab === 'attributes' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700">
                16 Faceted product attributen met vaste taxonomie-termen voor filtering:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ATTRIBUTES_DEFINITIONS.map((attr) => (
                  <div key={attr.name} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-900 text-xs">{attr.name}</span>
                      <code className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-700 font-mono">
                        {attr.slug}
                      </code>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {attr.terms.map((term) => (
                        <span key={term} className="px-2 py-0.5 bg-white rounded border border-slate-200 text-slate-600 text-[11px]">
                          {term}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Tags */}
          {activeTab === 'tags' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700">
                E-commerce tags voor marketing, collecties en navigatie:
              </div>

              <div className="flex flex-wrap gap-2">
                {TAGS_LIST.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-slate-100 rounded-lg text-slate-800 font-semibold border border-slate-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 5. Product-Level Fields */}
          {activeTab === 'fields' && (
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700">
                Verplichte product-level velden per e-bike conform specificatie:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">EAN / GTIN & Fabrikant-SKU</div>
                  <p className="text-slate-600">Unieke 13-cijferige barcode en distributeur referentie voor voorraadkoppeling.</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">Garantie & Termijnen</div>
                  <p className="text-slate-600">Opgesplitst per component: Frame (5-10j), Accu (2j / 75% capaciteit), Motor (2j).</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">EN 15194 & CE Normering</div>
                  <p className="text-slate-600">Europese veiligheidsstandaard voor pedelecs met maximaal 250W en 25 km/u afslag.</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">Speed Pedelec (45 km/u) Info</div>
                  <p className="text-slate-600">Geel bromfietskenteken, NTA 8776 helm, AM-rijbewijs en WA-verzekeringsplicht.</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200 col-span-1 sm:col-span-2">
                  <div className="font-bold text-slate-900 mb-1">Verzending & Aflevering</div>
                  <p className="text-slate-600">Gewicht, doosmaat, en keuze tussen 100% rijklaar bezorgd aan huis of in fabrieksdoos.</p>
                </div>
              </div>
            </div>
          )}

          {/* 6. SEO & Site Settings */}
          {activeTab === 'seo' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="font-bold text-slate-900 text-sm">SEO Titels Formule</div>
                <div className="p-2.5 bg-white rounded border border-slate-200 font-mono text-blue-700">
                  Merk Model, motormerk, accu Wh, framevorm
                </div>
                <p className="text-slate-600">
                  Voorbeeld: <em>Gazelle Grenoble C8 HMB, Bosch Middenmotor, 500 Wh, Lage instap</em>
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-sm">Indexatie & Filter-URL's</div>
                <p className="text-slate-600">
                  Filtercombinaties krijgen automatisch <code>noindex, follow</code> om duplicate content te voorkomen.
                  Alleen gecureerde SEO landingspagina's worden geïndexeerd:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  <li>Merkpagina's (bijv. <code>/merk/gazelle</code>, <code>/merk/cube</code>)</li>
                  <li>Merk × Type landingspagina's</li>
                  <li>Bosch Middenmotor (<code>/elektrische-fietsen/bosch-middenmotor</code>)</li>
                  <li>E-bike onder €2000 (<code>/aanbiedingen/e-bike-onder-2000</code>)</li>
                  <li>Elektrische damesfiets (<code>/elektrische-damesfiets</code>)</li>
                  <li>Fietsplan e-bikes WKR (<code>/fietsplan-e-bikes</code>)</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-sm">Site Settings</div>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div><strong>Taal:</strong> Nederlands (nl_NL)</div>
                  <div><strong>Valuta:</strong> EUR (€ incl. 21% BTW)</div>
                  <div><strong>Land:</strong> Nederland</div>
                  <div><strong>Betaling:</strong> iDEAL + SEPA + Crypto</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
