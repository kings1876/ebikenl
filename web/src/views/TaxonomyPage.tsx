'use client';

import React, { useState, useEffect } from 'react';
import { Link } from '@/lib/router';
import { TAXONOMY_CATEGORIES, ALL_BRANDS } from '../data/ebikes';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Database, Layers, Tag, Filter, Globe, Code, ArrowRight } from 'lucide-react';

export const TaxonomyPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <Breadcrumbs items={[{ label: 'Taxonomie & Architectuur' }]} />

      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
          <Database className="w-4 h-4" />
          <span>WooCommerce Data Model</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
          E-BIKE-TEKOOP.NL Taxonomie Specificatie
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Distributeur taxonomie, product-level velden, attributen en SEO regels
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Tab switcher */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-200 bg-slate-50/50 overflow-x-auto text-xs font-semibold">
          {[
            { key: 'categories', label: '1. Categorieën (Hiërarchie)' },
            { key: 'brands', label: '2. Merken (24 A-Merken)' },
            { key: 'attributes', label: '3. Attributen (16 Filters)' },
            { key: 'tags', label: '4. Tags (13 Thema\'s)' },
            { key: 'fields', label: '5. Product-Level Fields' },
            { key: 'seo', label: '6. SEO & Site Settings' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`pb-3.5 px-3.5 transition-colors border-b-2 -mb-px whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8 text-xs space-y-6">
          {activeTab === 'categories' && (
            <div className="space-y-4">
              <p className="text-slate-600">
                Hiërarchische structuur voor productcategorieën en subcategorieën in WooCommerce:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {TAXONOMY_CATEGORIES.map((cat) => (
                  <div key={cat.main} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="font-bold text-slate-900 text-sm flex items-center justify-between">
                      <span>{cat.main}</span>
                      <Link
                        to={`/categorie/${cat.main.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                        className="text-[11px] text-blue-600 hover:underline flex items-center gap-0.5"
                      >
                        <span>Bekijk</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                    <ul className="space-y-1.5 pl-3 border-l-2 border-slate-200 text-slate-600 text-[11px]">
                      {cat.subs.map((sub) => (
                        <li key={sub}>
                          <Link
                            to={`/categorie/${cat.main.toLowerCase().replace(/[^a-z0-9]+/g, '-')}?sub=${encodeURIComponent(sub)}`}
                            className="hover:text-blue-600"
                          >
                            └─ {sub}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'brands' && (
            <div className="space-y-4">
              <p className="text-slate-600">
                24 A-Merken via distributeur, elk met een eigen geoptimaliseerde merkpagina:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {ALL_BRANDS.map((brand) => (
                  <Link
                    key={brand}
                    to={`/merk/${brand.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                    className="p-3 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 rounded-xl border border-slate-200 text-center font-bold text-slate-800 transition-colors block"
                  >
                    <div>{brand}</div>
                    <div className="text-[10px] text-blue-600 font-normal mt-0.5">/merk/{brand.toLowerCase().replace(/[^a-z0-9]+/g, '-')}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'attributes' && (
            <div className="space-y-4">
              <p className="text-slate-600">
                16 Vaste product attributen voor multi-select faceted filtering:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ATTRIBUTES_DEFINITIONS.map((attr) => (
                  <div key={attr.name} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-900 text-xs">{attr.name}</span>
                      <code className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-700 font-mono">
                        {attr.slug}
                      </code>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {attr.terms.map((term) => (
                        <span key={term} className="px-2 py-0.5 bg-white rounded border border-slate-200 text-slate-700 text-[11px]">
                          {term}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tags' && (
            <div className="space-y-4">
              <p className="text-slate-600">
                13 Commerciële e-commerce tags voor thema-landingspagina's:
              </p>
              <div className="flex flex-wrap gap-2">
                {TAGS_LIST.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-slate-100 rounded-lg text-slate-800 font-semibold border border-slate-200 text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'fields' && (
            <div className="space-y-3">
              <p className="text-slate-600">
                Product-level velden vereist per e-bike in de database:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">EAN / GTIN & Fabrikant-SKU</div>
                  <p className="text-slate-600">Unieke 13-cijferige barcode en distributeur referentie voor voorraadkoppeling.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">Garantie & Termijnen</div>
                  <p className="text-slate-600">Frame (5-10 jaar), Accu (2 jaar / 75% capaciteit), Motor (2 jaar).</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">EN 15194 & CE Normering</div>
                  <p className="text-slate-600">Europese veiligheidsnorm voor elektrische trapondersteuning tot 250W en 25 km/u.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">Speed Pedelec (45 km/u) Regels</div>
                  <p className="text-slate-600">Geel bromfietskenteken, NTA 8776 gekeurde helm, AM-rijbewijs en WA-verzekering.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-sm">SEO Titels Formule</div>
                <div className="p-2.5 bg-white rounded border border-slate-200 font-mono text-blue-700 text-xs">
                  Merk Model, motormerk, accu Wh, framevorm
                </div>
                <p className="text-slate-600">
                  Voorbeeld: <em>Gazelle Grenoble C8 HMB, Bosch Middenmotor, 500 Wh, Lage instap</em>
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-sm">Indexatie & Filter-URL's</div>
                <p className="text-slate-600">
                  Dynamische facetfilter queries krijgen <code>noindex, follow</code> om duplicate content te voorkomen.
                  Alleen gecureerde SEO landingspagina's en merkpagina's worden geïndexeerd in Google.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-sm">Site Settings</div>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div><strong>Taal:</strong> Nederlands (nl_NL)</div>
                  <div><strong>Valuta:</strong> EUR (€ incl. 21% BTW)</div>
                  <div><strong>Land:</strong> Nederland</div>
                  <div><strong>Betaling:</strong> iDEAL + SEPA + Crypto (BTC/ETH/USDT)</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
