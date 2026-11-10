import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { formatEur, eurToCrypto, calculateVat } from '../utils/format';
import { X, Trash2, ShoppingBag, Truck, ShieldCheck, ArrowRight, Coins } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    cartTotal,
    updateQuantity,
    removeFromCart
  } = useShop();

  if (!isCartDrawerOpen) return null;

  const { exclVat, vatAmount } = calculateVat(cartTotal);
  const freeShippingThreshold = 50;
  const isFreeShipping = cartTotal >= freeShippingThreshold;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              Winkelwagen ({cart.reduce((acc, item) => acc + item.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free delivery notification */}
        <div className="bg-emerald-50 px-4 py-2.5 border-b border-emerald-100 text-xs text-emerald-800 flex items-center gap-2">
          <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            {isFreeShipping ? (
              <strong>Gefeliciteerd! Gratis 100% rijklaar bezorging aan huis.</strong>
            ) : (
              `Bestel voor nog ${formatEur(freeShippingThreshold - cartTotal)} voor gratis bezorging.`
            )}
          </span>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <div className="text-sm font-semibold text-slate-800">
                Je winkelwagen is nog leeg
              </div>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Bekijk onze collectie nieuwe A-merk elektrische fietsen en voeg jouw droomfiets toe.
              </p>
              <Link
                to="/categorie/elektrische-fietsen"
                onClick={() => setIsCartDrawerOpen(false)}
                className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
              >
                Bekijk aanbod
              </Link>
            </div>
          ) : (
            cart.map((item, index) => (
              <div
                key={`${item.product.id}-${item.selectedFramemaat}-${index}`}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex gap-3 relative group"
              >
                {/* Image */}
                <Link
                  to={`/product/${item.product.slug}`}
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-20 h-20 bg-white rounded-lg border border-slate-200 p-1 flex items-center justify-center shrink-0 hover:opacity-90"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/product/${item.product.slug}`}
                        onClick={() => setIsCartDrawerOpen(false)}
                        className="text-xs font-bold text-slate-900 line-clamp-1 hover:text-blue-600"
                      >
                        {item.product.brand} {item.product.model}
                      </Link>
                      <button
                        onClick={() => removeFromCart(index)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-0.5"
                        title="Verwijder"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-slate-500 space-y-0.5 mt-0.5">
                      <div>Framemaat: {item.selectedFramemaat} · {item.selectedKleur}</div>
                      <div className="text-blue-700 font-medium">{item.assemblyOption}</div>
                    </div>
                  </div>

                  {/* Quantity & Price */}
                  <div className="flex items-center justify-between pt-2 mt-1 border-t border-slate-200/60">
                    <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded px-1.5 py-0.5">
                      <button
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                        className="text-xs text-slate-500 hover:text-slate-900 px-1 font-bold"
                      >
                        -
                      </button>
                      <span className="text-xs font-semibold tabular-nums px-1 text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                        className="text-xs text-slate-500 hover:text-slate-900 px-1 font-bold"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-xs font-bold text-slate-900 tabular-nums">
                      {formatEur(item.product.price * item.quantity)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/70 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotaal excl. BTW:</span>
                <span className="tabular-nums font-mono">{formatEur(exclVat)}</span>
              </div>
              <div className="flex justify-between">
                <span>21% BTW:</span>
                <span className="tabular-nums font-mono">{formatEur(vatAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Bezorging & rijklaar:</span>
                <span className="text-emerald-700 font-semibold">Gratis</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-1.5 border-t border-slate-200">
                <span>Totaal incl. BTW:</span>
                <span className="tabular-nums text-base">{formatEur(cartTotal)}</span>
              </div>

              {/* Crypto equivalent */}
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Coins className="w-3 h-3 text-amber-500" />
                  <span>Crypto prijs:</span>
                </span>
                <span>≈ {eurToCrypto(cartTotal, 'BTC')} BTC · {eurToCrypto(cartTotal, 'USDT')} USDT</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                to="/winkelwagen"
                onClick={() => setIsCartDrawerOpen(false)}
                className="py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-800 font-semibold rounded-xl border border-slate-200 transition-colors text-center text-xs"
              >
                Bekijk wagen
              </Link>
              <Link
                to="/afrekenen"
                onClick={() => setIsCartDrawerOpen(false)}
                className="py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all text-center text-xs flex items-center justify-center gap-1.5"
              >
                <span>Afrekenen</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Trust badge */}
            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>iDEAL · SEPA · Crypto</span>
              </span>
              <span>·</span>
              <span className="text-[#00b67a] font-semibold">Trustpilot 4.8</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
