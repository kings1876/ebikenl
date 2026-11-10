'use client';

import React, { useEffect } from 'react';
import { Link, useNavigate } from '@/lib/router';
import { useShop } from '../context/ShopContext';
import { formatEur, eurToCrypto, calculateVat } from '../utils/format';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ShoppingBag, Trash2, ArrowRight, Truck, ShieldCheck, ArrowLeft, Coins } from 'lucide-react';

export const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useShop();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Winkelwagen | E-BIKE-TEKOOP.NL';
    window.scrollTo(0, 0);
  }, []);

  const { exclVat, vatAmount } = calculateVat(cartTotal);
  const isFreeShipping = cartTotal >= 50;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <Breadcrumbs items={[{ label: 'Winkelwagen' }]} />

      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Winkelwagen
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {cart.length} artikel(en) in je overzicht
          </p>
        </div>

        <Link
          to="/categorie/elektrische-fietsen"
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Verder winkelen</span>
        </Link>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 max-w-lg mx-auto">
          <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Je winkelwagen is nog leeg</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Kies uit onze collectie nieuwe A-merk elektrische fietsen met fabrieksgarantie en 100% rijklaar bezorging aan huis.
          </p>
          <Link
            to="/categorie/elektrische-fietsen"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700"
          >
            <span>Bekijk alle e-bikes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Items list (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free shipping banner */}
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center gap-3 text-xs text-emerald-900">
              <Truck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                <strong>Gratis verzending & rijklaar aflevering aan huis</strong> geactiveerd voor jouw bestelling!
              </span>
            </div>

            {/* Items */}
            <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
              {cart.map((item, index) => (
                <div key={index} className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                  {/* Thumb + info */}
                  <div className="flex gap-4 items-center">
                    <Link
                      to={`/product/${item.product.slug}`}
                      className="w-24 h-24 bg-slate-50 rounded-xl border border-slate-200 p-2 shrink-0 flex items-center justify-center hover:opacity-90"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain"
                      />
                    </Link>

                    <div className="space-y-1">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        {item.product.brand}
                      </div>
                      <Link
                        to={`/product/${item.product.slug}`}
                        className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors block leading-tight"
                      >
                        {item.product.model}
                      </Link>
                      <div className="text-xs text-slate-500">
                        Framemaat: <strong>{item.selectedFramemaat}</strong> · Kleur: <strong>{item.selectedKleur}</strong>
                      </div>
                      <div className="text-xs text-emerald-700 font-medium">
                        ✓ {item.assemblyOption}
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Price */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
                      <button
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                        className="text-xs font-bold text-slate-600 hover:text-slate-900 px-1"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold tabular-nums px-2 text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                        className="text-xs font-bold text-slate-600 hover:text-slate-900 px-1"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-extrabold text-slate-900 tabular-nums">
                        {formatEur(item.product.price * item.quantity)}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {formatEur(item.product.price)} p.st.
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(index)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Verwijder uit winkelwagen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Order Summary (4 cols) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 sticky top-24">
            <h2 className="text-base font-bold text-slate-900">Besteloverzicht</h2>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotaal excl. BTW:</span>
                <span className="tabular-nums font-mono">{formatEur(exclVat)}</span>
              </div>
              <div className="flex justify-between">
                <span>21% Nederlandse BTW:</span>
                <span className="tabular-nums font-mono">{formatEur(vatAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Verzendkosten:</span>
                <span className="text-emerald-700 font-bold">Gratis</span>
              </div>
              <div className="flex justify-between">
                <span>100% Rijklaar service:</span>
                <span className="text-emerald-700 font-bold">Inbegrepen</span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline font-bold text-slate-900">
                <span className="text-sm">Totaalbedrag (incl. BTW):</span>
                <span className="text-xl tabular-nums text-blue-700">{formatEur(cartTotal)}</span>
              </div>

              {/* Crypto Preview */}
              <div className="pt-2 text-[11px] font-mono text-slate-500 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Coins className="w-3 h-3 text-amber-500" />
                  <span>Crypto equivalent:</span>
                </span>
                <span>≈ {eurToCrypto(cartTotal, 'BTC')} BTC</span>
              </div>
            </div>

            <Link
              to="/afrekenen"
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
            >
              <span>Doorgaan naar afrekenen</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Trust markers */}
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1.5">
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Veilig betalen met iDEAL, SEPA & Crypto</span>
              </div>
              <div>✓ 14 dagen wettelijk bedenkrecht</div>
              <div>✓ Fabrieksgarantie tot 10 jaar op frame</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
