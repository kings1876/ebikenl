'use client';

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from '@/lib/router';
import { PRODUCTS, SITE_TRUSTPILOT_REVIEWS } from '../data/ebikes';
import { Product, Framemaat, Kleur } from '../types/ebike';
import { formatEur, eurToCrypto, calculateVat } from '../utils/format';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ProductCard } from '../components/ProductCard';
import { useShop } from '../context/ShopContext';
import {
  Battery,
  Zap,
  ShieldCheck,
  Truck,
  CheckCircle,
  HelpCircle,
  Coins,
  FileText,
  AlertTriangle,
  Scale,
  Sparkles,
  ShoppingBag,
  ArrowLeft
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart, toggleCompare, isCompared } = useShop();

  const product = PRODUCTS.find((p) => p.slug === slug);

  const [selectedFramemaat, setSelectedFramemaat] = useState<Framemaat>(
    product?.framematen[0] || '50 cm'
  );
  const [selectedKleur, setSelectedKleur] = useState<Kleur>(
    product?.kleuren[0] || 'Zwart'
  );
  const [selectedImage, setSelectedImage] = useState<string>(product?.image || '');
  const [assemblyOption, setAssemblyOption] = useState<
    '100% Rijklaar thuisbezorgd' | 'In fabrieksdoos (90% gemonteerd)'
  >('100% Rijklaar thuisbezorgd');
  const [showWkrCalculator, setShowWkrCalculator] = useState(false);
  const [taxBracket, setTaxBracket] = useState<36.93 | 49.5>(36.93);
  const [activeTab, setActiveTab] = useState<'specificaties' | 'garantie' | 'reviews' | 'verzending'>('specificaties');

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      setSelectedFramemaat(product.framematen[0] || '50 cm');
      setSelectedKleur(product.kleuren[0] || 'Zwart');
      window.scrollTo(0, 0);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">E-bike niet gevonden</h1>
        <p className="text-slate-600 mb-6">Het gezochte e-bike model bestaat niet of is niet meer leverbaar.</p>
        <Link
          to="/categorie/elektrische-fietsen"
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm inline-flex items-center gap-2 hover:bg-blue-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Bekijk alle elektrische fietsen</span>
        </Link>
      </div>
    );
  }

  const compared = isCompared(product.id);
  const { exclVat, vatAmount } = calculateVat(product.price);
  const wkrSavings = Math.round(product.price * (taxBracket / 100));
  const netPrice = product.price - wkrSavings;

  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && (p.brand === product.brand || p.subCategory === product.subCategory)
  ).slice(0, 3);

  const getMaatAdvice = (maat: Framemaat) => {
    switch (maat) {
      case '46 cm':
        return 'Lichaamslengte: 155 - 168 cm';
      case '50 cm':
        return 'Lichaamslengte: 165 - 176 cm';
      case '53 cm':
        return 'Lichaamslengte: 172 - 184 cm';
      case '56 cm':
        return 'Lichaamslengte: 180 - 192 cm';
      case '59 cm':
        return 'Lichaamslengte: 188 - 198 cm';
      case '61 cm':
        return 'Lichaamslengte: 195+ cm';
      default:
        return 'Universeel passend';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Elektrische fietsen', path: '/categorie/elektrische-fietsen' },
          { label: product.subCategory, path: `/categorie/elektrische-fietsen?sub=${encodeURIComponent(product.subCategory)}` },
          { label: product.brand, path: `/merk/${product.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` },
          { label: `${product.model}` }
        ]}
      />

      {/* Main PDP 2-column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Gallery & Highlights (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-4/3 w-full bg-white rounded-2xl border border-slate-200/90 overflow-hidden flex items-center justify-center p-6 shadow-xs">
            <img
              src={selectedImage}
              alt={product.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Thumbnails */}
          {product.galleryImages && product.galleryImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {product.galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-24 h-18 rounded-xl border-2 overflow-hidden bg-white shrink-0 transition-colors ${
                    selectedImage === img
                      ? 'border-blue-600 shadow-xs'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt="Thumbnail"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Trustpilot Banner Strip */}
          <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 bg-[#00b67a] text-white flex items-center justify-center rounded-[2px] text-xs font-bold">
                ★
              </div>
              <span className="font-bold text-slate-900">Trustpilot Score 4.8 / 5</span>
              <span className="text-slate-600">· Uitstekend ({product.reviewCount} geverifieerde reviews)</span>
            </div>
            <span className="text-emerald-700 font-semibold hidden sm:inline">✓ Geverifieerde aankoop</span>
          </div>

          {/* Detailed Description */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
            <h2 className="text-base font-bold text-slate-900">
              Over de {product.brand} {product.model}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module (5 cols) */}
        <div className="lg:col-span-5 space-y-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <Link
                to={`/merk/${product.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                className="font-bold text-blue-600 uppercase tracking-wide hover:underline"
              >
                {product.brand}
              </Link>
              <span className="font-mono">SKU: {product.sku}</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {product.title}
            </h1>
          </div>

          {/* Pricing Box */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-2.5">
                <span className="text-3xl font-black text-slate-900 tabular-nums">
                  {formatEur(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-slate-400 line-through tabular-nums">
                    {formatEur(product.originalPrice)}
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                {product.leverbaarheid}
              </span>
            </div>

            <div className="text-xs text-slate-500 mt-1">
              Inclusief 21% BTW ({formatEur(vatAmount)}) · Netto excl. BTW: {formatEur(exclVat)}
            </div>

            {/* Crypto Conversion Preview */}
            <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-mono text-slate-600">
              <div className="flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-amber-500" />
                <span>Betaal met Crypto:</span>
              </div>
              <div className="font-medium text-slate-900">
                ≈ {eurToCrypto(product.price, 'BTC')} BTC · {eurToCrypto(product.price, 'USDT')} USDT
              </div>
            </div>
          </div>

          {/* Framemaat Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Kies Framemaat
            </label>
            <div className="grid grid-cols-4 gap-2">
              {product.framematen.map((maat) => (
                <button
                  key={maat}
                  onClick={() => setSelectedFramemaat(maat)}
                  className={`py-2 px-2 text-xs font-bold rounded-lg border text-center transition-colors ${
                    selectedFramemaat === maat
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {maat}
                </button>
              ))}
            </div>
            <div className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>{getMaatAdvice(selectedFramemaat)}</span>
            </div>
          </div>

          {/* Kleur Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Kleur: <span className="font-normal text-slate-600">{selectedKleur}</span>
            </label>
            <div className="flex items-center gap-2">
              {product.kleuren.map((kleur) => (
                <button
                  key={kleur}
                  onClick={() => setSelectedKleur(kleur)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                    selectedKleur === kleur
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {kleur}
                </button>
              ))}
            </div>
          </div>

          {/* Rijklaar Montage Optie */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Aflevermethode
            </label>
            <div className="space-y-1.5 text-xs">
              <label className="flex items-start gap-2.5 p-2.5 rounded-lg border bg-white cursor-pointer border-blue-500/80">
                <input
                  type="radio"
                  name="assembly"
                  checked={assemblyOption === '100% Rijklaar thuisbezorgd'}
                  onChange={() => setAssemblyOption('100% Rijklaar thuisbezorgd')}
                  className="mt-0.5 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <span>100% Rijklaar thuisbezorgd door monteur</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-1.5 py-0.2 rounded">
                      Gratis service
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Zadel en stuur op lengte afgesteld, software update & pedalen gemonteerd.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2.5 rounded-lg border bg-white cursor-pointer border-slate-200">
                <input
                  type="radio"
                  name="assembly"
                  checked={assemblyOption === 'In fabrieksdoos (90% gemonteerd)'}
                  onChange={() => setAssemblyOption('In fabrieksdoos (90% gemonteerd)')}
                  className="mt-0.5 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="font-semibold text-slate-900">
                    In fabrieksdoos (90% gemonteerd)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Zelf voorwiel, stuur en pedalen monteren.
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Actions: Add to Cart + Compare */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => addToCart(product, selectedFramemaat, selectedKleur, assemblyOption)}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>In winkelwagen · {formatEur(product.price)}</span>
            </button>

            <button
              onClick={() => toggleCompare(product)}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 transition-colors ${
                compared
                  ? 'bg-blue-50 text-blue-700 border-blue-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>{compared ? 'Toegevoegd aan vergelijking' : 'Vergelijk met andere e-bikes'}</span>
            </button>
          </div>

          {/* Fietsplan Calculator Toggle */}
          <button
            onClick={() => setShowWkrCalculator(!showWkrCalculator)}
            className="w-full py-2.5 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Fietsplan calculator: bespaar tot {formatEur(Math.round(product.price * 0.495))}</span>
            </span>
            <span className="text-blue-600 underline text-[11px]">
              {showWkrCalculator ? 'Sluiten' : 'Bereken voordeel'}
            </span>
          </button>

          {showWkrCalculator && (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-amber-200 text-xs space-y-2.5">
              <div className="font-bold text-slate-900">
                Zakelijk Fietsplan (WKR Belastingvoordeel)
              </div>
              <p className="text-slate-600 text-[11px]">
                Koop deze e-bike via je brutoloon en betaal tot 49,5% minder inkomstenbelasting.
              </p>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-600">Belastingschijf:</span>
                <button
                  onClick={() => setTaxBracket(36.93)}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold border ${
                    taxBracket === 36.93
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  36,93%
                </button>
                <button
                  onClick={() => setTaxBracket(49.5)}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold border ${
                    taxBracket === 49.5
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  49,50%
                </button>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-bold">
                <span>Jouw netto aankoopprijs:</span>
                <span className="text-emerald-700 tabular-nums text-sm">
                  {formatEur(netPrice)}
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                Factuur voldoet aan de eisen voor WKR, FiscFree en Hellorider.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Speed Pedelec Warning if 45 km/h */}
      {product.speedPedelecRequirements && (
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-sm block">
              Speed Pedelec Regelgeving (45 km/u)
            </span>
            <p>
              Voor deze snelle e-bike geldt de Nederlandse wetgeving voor bromfietsen:
              geel bromfietskenteken verplicht, NTA 8776 gekeurde helm verplicht, en minimaal
              een AM-rijbewijs. Wij verzorgen de RDW-registratie en het kenteken direct bij aflevering!
            </p>
          </div>
        </div>
      )}

      {/* Full Technical Specifications & Warranty Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200 overflow-x-auto">
          {[
            { key: 'specificaties', label: 'Volledige Specificaties' },
            { key: 'garantie', label: 'Fabrieksgarantie & Certificering' },
            { key: 'reviews', label: `Reviews (${product.reviewCount})` },
            { key: 'verzending', label: 'Bezorging & Montage' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`pb-3 px-2 text-sm font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Specificaties */}
        {activeTab === 'specificaties' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Merk & Model</span>
              <span className="font-semibold text-slate-900">{product.brand} {product.model}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Motormerk & Type</span>
              <span className="font-semibold text-slate-900">{product.motormerk} ({product.motorModel})</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Motorpositie</span>
              <span className="font-semibold text-slate-900">{product.motorpositie}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Motorkoppel</span>
              <span className="font-semibold text-slate-900">{product.motorTorqueNm} Nm</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Accucapaciteit</span>
              <span className="font-semibold text-slate-900">{product.accucapaciteit} ({product.accuWhNumber} Wh)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Actieradius</span>
              <span className="font-semibold text-slate-900">{product.actieradius}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Versnellingssysteem</span>
              <span className="font-semibold text-slate-900">{product.versnelling} ({product.versnellingDetail})</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Aandrijving</span>
              <span className="font-semibold text-slate-900">{product.aandrijving === 'Riem' ? 'Gates Carbon Riem (Onderhoudsvrij)' : 'Ketting'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Remsysteem</span>
              <span className="font-semibold text-slate-900">{product.remtype}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Wielmaat</span>
              <span className="font-semibold text-slate-900">{product.wielmaat}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Gewicht</span>
              <span className="font-semibold text-slate-900">{product.gewichtKg} kg ({product.gewichtKlasse})</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Max. toelaatbaar gewicht</span>
              <span className="font-semibold text-slate-900">{product.maxGebruikersgewicht}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">EAN / GTIN Barcode</span>
              <span className="font-mono text-slate-900">{product.ean}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Fabrikant-SKU</span>
              <span className="font-mono text-slate-900">{product.sku}</span>
            </div>
          </div>
        )}

        {/* Tab 2: Garantie */}
        {activeTab === 'garantie' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-slate-500">Framegarantie</div>
                <div className="font-bold text-slate-900 text-sm mt-1">{product.warranty.frame}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-slate-500">Accugarantie</div>
                <div className="font-bold text-slate-900 text-sm mt-1">{product.warranty.battery}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-slate-500">Motorgarantie</div>
                <div className="font-bold text-slate-900 text-sm mt-1">{product.warranty.motor}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-700 pt-2">
              <CheckCircle className="w-4 h-4 text-[#00b67a]" />
              <span>Conform EN 15194 en Europese CE-keuring voor elektrische trapondersteuning.</span>
            </div>
          </div>
        )}

        {/* Tab 3: Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-900 text-base">Trustpilot</span>
                <span className="text-[#00b67a] font-bold">★★★★★ 4.8 / 5</span>
              </div>
              <span className="text-slate-500">{product.reviewCount} geverifieerde kopersbeoordelingen</span>
            </div>

            <div className="space-y-3">
              {product.reviews.map((r) => (
                <div key={r.id} className="p-4 rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-bold text-slate-900">{r.title}</div>
                    <span className="text-slate-400">{r.date}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed mb-2">{r.content}</p>
                  <div className="text-slate-400 flex items-center gap-2">
                    <span className="font-medium text-slate-700">{r.author}</span>
                    <span>·</span>
                    <span>{r.city}</span>
                    <span>·</span>
                    <span className="text-emerald-700 font-medium">Geverifieerde koper</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Verzending */}
        {activeTab === 'verzending' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>Bezorging & Transport</span>
              </div>
              <ul className="space-y-1.5 text-slate-600">
                <li><strong>Transportgewicht:</strong> {product.shipping.weightKg} kg</li>
                <li><strong>Doosafmetingen:</strong> {product.shipping.boxDimensions}</li>
                <li><strong>Bezorging:</strong> Gratis in heel Nederland</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>100% Rijklaar Aflevering</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                De bezorger belt 30 minuten van tevoren. Zadel en stuur worden persoonlijk afgesteld en u krijgt een korte instructie over de boordcomputer en batterij.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="pt-6 border-t border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            Bekijk ook deze modellen van {product.brand}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
