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
import { useTr } from '@/i18n/locale';
import { subHref } from '../lib/seoCopy';

export const ProductDetailPage: React.FC = () => {
  const tr = useTr();

  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart, toggleCompare, isCompared } = useShop();

  const product = PRODUCTS.find((p) => p.slug === slug);

  const [selectedFramemaat, setSelectedFramemaat] = useState<Framemaat>(
    product?.framematen?.[0] || '50 cm'
  );
  const [selectedKleur, setSelectedKleur] = useState<Kleur>(
    product?.kleuren?.[0] || 'Zwart'
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
      setSelectedFramemaat(product.framematen?.[0] || '50 cm');
      setSelectedKleur(product.kleuren?.[0] || 'Zwart');
      window.scrollTo(0, 0);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{tr("E-bike niet gevonden")}</h1>
        <p className="text-slate-600 mb-6">{tr("Het gezochte e-bike model bestaat niet of is niet meer leverbaar.")}</p>
        <Link
          to="/categorie/elektrische-fietsen"
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm inline-flex items-center gap-2 hover:bg-blue-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{tr("Bekijk alle elektrische fietsen")}</span>
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
          { label: product.subCategory, path: subHref(product.subCategory) },
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
                    alt={`${product.title} (${tr("foto")} ${idx + 1})`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Trustpilot Banner Strip */}
          {product.reviewCount ? (<div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 bg-[#00b67a] text-white flex items-center justify-center rounded-[2px] text-xs font-bold">
                ★
              </div>
              <span className="font-bold text-slate-900">{tr("Trustpilot Score 4.8 / 5")}</span>
              <span className="text-slate-600">{tr("· Uitstekend (")}{tr(product.reviewCount)} {tr("geverifieerde reviews)")}</span>
            </div>
            <span className="text-emerald-700 font-semibold hidden sm:inline">{tr("✓ Geverifieerde aankoop")}</span>
          </div>) : null}

          {/* Detailed Description */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
            <h2 className="text-base font-bold text-slate-900">
              {tr("Over de")} {tr(product.brand)} {tr(product.model)}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {tr(product.description)}
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
                {tr(product.brand)}
              </Link>
              <span className="font-mono">{tr("SKU:")} {tr(product.sku)}</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {tr(product.title)}
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
                {tr(product.leverbaarheid)}
              </span>
            </div>

            <div className="text-xs text-slate-500 mt-1">
              {tr("Inclusief 21% BTW (")}{formatEur(vatAmount)}{tr(") · Netto excl. BTW:")} {formatEur(exclVat)}
            </div>

            {/* Crypto Conversion Preview */}
            <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-mono text-slate-600">
              <div className="flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-amber-500" />
                <span>{tr("Betaal met Crypto:")}</span>
              </div>
              <div className="font-medium text-slate-900">
                ≈ {eurToCrypto(product.price, 'BTC')} {tr("BTC ·")} {eurToCrypto(product.price, 'USDT')} {tr("USDT")}
              </div>
            </div>
          </div>

          {/* Framemaat Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              {tr("Kies Framemaat")}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(product.framematen ?? []).map((maat) => (
                <button
                  key={maat}
                  onClick={() => setSelectedFramemaat(maat)}
                  className={`py-2 px-2 text-xs font-bold rounded-lg border text-center transition-colors ${
                    selectedFramemaat === maat
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {tr(maat)}
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
              {tr("Kleur:")} <span className="font-normal text-slate-600">{tr(selectedKleur)}</span>
            </label>
            <div className="flex items-center gap-2">
              {(product.kleuren ?? []).map((kleur) => (
                <button
                  key={kleur}
                  onClick={() => setSelectedKleur(kleur)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                    selectedKleur === kleur
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {tr(kleur)}
                </button>
              ))}
            </div>
          </div>

          {/* Rijklaar Montage Optie */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              {tr("Aflevermethode")}
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
                    <span>{tr("100% Rijklaar thuisbezorgd door monteur")}</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-1.5 py-0.2 rounded">
                      {tr("Gratis service")}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {tr("Zadel en stuur op lengte afgesteld, software update & pedalen gemonteerd.")}
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
                    {tr("In fabrieksdoos (90% gemonteerd)")}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {tr("Zelf voorwiel, stuur en pedalen monteren.")}
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
              <span>{tr("In winkelwagen ·")} {formatEur(product.price)}</span>
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
              <span>{compared ? tr("Toegevoegd aan vergelijking") : tr("Vergelijk met andere e-bikes")}</span>
            </button>
          </div>

          {/* Fietsplan Calculator Toggle */}
          <button
            onClick={() => setShowWkrCalculator(!showWkrCalculator)}
            className="w-full py-2.5 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{tr("Fietsplan calculator: bespaar tot")} {formatEur(Math.round(product.price * 0.495))}</span>
            </span>
            <span className="text-blue-600 underline text-[11px]">
              {showWkrCalculator ? tr("Sluiten") : tr("Bereken voordeel")}
            </span>
          </button>

          {showWkrCalculator && (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-amber-200 text-xs space-y-2.5">
              <div className="font-bold text-slate-900">
                {tr("Zakelijk Fietsplan (WKR Belastingvoordeel)")}
              </div>
              <p className="text-slate-600 text-[11px]">
                {tr("Koop deze e-bike via je brutoloon en betaal tot 49,5% minder inkomstenbelasting.")}
              </p>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-600">{tr("Belastingschijf:")}</span>
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
                <span>{tr("Jouw netto aankoopprijs:")}</span>
                <span className="text-emerald-700 tabular-nums text-sm">
                  {formatEur(netPrice)}
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                {tr("Factuur voldoet aan de eisen voor WKR, FiscFree en Hellorider.")}
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
              {tr("Speed Pedelec Regelgeving (45 km/u)")}
            </span>
            <p>
              {tr("Voor deze snelle e-bike geldt de Nederlandse wetgeving voor bromfietsen: geel bromfietskenteken verplicht, NTA 8776 gekeurde helm verplicht, en minimaal een AM-rijbewijs. Wij verzorgen de RDW-registratie en het kenteken direct bij aflevering!")}
            </p>
          </div>
        </div>
      )}

      {/* Full Technical Specifications & Warranty Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200 overflow-x-auto">
          {[
            { key: 'specificaties', label: 'Volledige Specificaties' },
            ...(product.warranty ? [{ key: 'garantie', label: 'Fabrieksgarantie & Certificering' }] : []),
            ...(product.reviewCount ? [{ key: 'reviews', label: `Reviews (${product.reviewCount})` }] : []),
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
              {tr(tab.label)}
            </button>
          ))}
        </div>

        {/* Tab 1: Specificaties */}
        {activeTab === 'specificaties' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0 text-xs">
              <div className="flex justify-between gap-4 py-2 border-b border-slate-100">
                <span className="text-slate-500">{tr("Merk & Model")}</span>
                <span className="font-semibold text-slate-900 text-right">{tr(product.brand)} {tr(product.model)}</span>
              </div>
              {Object.entries(product.specs ?? {}).filter(([, v]) => v && v !== '-').map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-2 border-b border-slate-100">
                  <span className="text-slate-500 shrink-0">{tr(k)}</span>
                  <span className="font-semibold text-slate-900 text-right">{v}</span>
                </div>
              ))}
            </div>
            {product.source && (
              <p className="text-[11px] text-slate-500">
                {tr("Bron specificaties: officiële website van de fabrikant (opgehaald")} {product.source.retrieved}{tr("). Specificaties en prijs kunnen zonder voorafgaande kennisgeving wijzigen.")}
              </p>
            )}
          </div>
        )}

        {activeTab === 'garantie' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-slate-500">{tr("Framegarantie")}</div>
                <div className="font-bold text-slate-900 text-sm mt-1">{tr((product.warranty?.frame ?? "-"))}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-slate-500">{tr("Accugarantie")}</div>
                <div className="font-bold text-slate-900 text-sm mt-1">{tr((product.warranty?.battery ?? "-"))}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-slate-500">{tr("Motorgarantie")}</div>
                <div className="font-bold text-slate-900 text-sm mt-1">{tr((product.warranty?.motor ?? "-"))}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-700 pt-2">
              <CheckCircle className="w-4 h-4 text-[#00b67a]" />
              <span>{tr("Conform EN 15194 en Europese CE-keuring voor elektrische trapondersteuning.")}</span>
            </div>
          </div>
        )}

        {/* Tab 3: Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-900 text-base">{tr("Trustpilot")}</span>
                <span className="text-[#00b67a] font-bold">★★★★★ 4.8 / 5</span>
              </div>
              <span className="text-slate-500">{tr(product.reviewCount)} {tr("geverifieerde kopersbeoordelingen")}</span>
            </div>

            <div className="space-y-3">
              {product.reviews.map((r) => (
                <div key={r.id} className="p-4 rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-bold text-slate-900">{tr(r.title)}</div>
                    <span className="text-slate-400">{tr(r.date)}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed mb-2">{tr(r.content)}</p>
                  <div className="text-slate-400 flex items-center gap-2">
                    <span className="font-medium text-slate-700">{tr(r.author)}</span>
                    <span>·</span>
                    <span>{tr(r.city)}</span>
                    <span>·</span>
                    <span className="text-emerald-700 font-medium">{tr("Geverifieerde koper")}</span>
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
                <span>{tr("Bezorging & Transport")}</span>
              </div>
              <ul className="space-y-1.5 text-slate-600">
                <li><strong>{tr("Transportgewicht:")}</strong> {tr((product.shipping?.weightKg ?? "-"))} {tr("kg")}</li>
                <li><strong>{tr("Doosafmetingen:")}</strong> {tr((product.shipping?.boxDimensions ?? "-"))}</li>
                <li><strong>{tr("Bezorging:")}</strong> {tr("Gratis in heel Nederland")}</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{tr("100% Rijklaar Aflevering")}</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                {tr("De bezorger belt 30 minuten van tevoren. Zadel en stuur worden persoonlijk afgesteld en u krijgt een korte instructie over de boordcomputer en batterij.")}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="pt-6 border-t border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            {tr("Bekijk ook deze modellen van")} {tr(product.brand)}
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
