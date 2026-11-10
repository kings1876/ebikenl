import React, { useState, useEffect } from 'react';
import { CartItem } from '../types/ebike';
import { formatEur, eurToCrypto, calculateVat } from '../utils/format';
import {
  X,
  CreditCard,
  Building,
  Coins,
  CheckCircle,
  Copy,
  Clock,
  ShieldCheck,
  FileText,
  Truck,
  ArrowRight
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderComplete: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderComplete
}) => {
  if (!isOpen) return null;

  const totalEur = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const { exclVat, vatAmount } = calculateVat(totalEur);

  const [paymentMethod, setPaymentMethod] = useState<'ideal' | 'bank' | 'crypto'>('ideal');
  const [selectedBank, setSelectedBank] = useState<string>('rabobank');
  const [cryptoAsset, setCryptoAsset] = useState<'BTC' | 'ETH' | 'USDT'>('BTC');
  const [cryptoAddressCopied, setCryptoAddressCopied] = useState(false);
  const [ibanCopied, setIbanCopied] = useState(false);
  const [countdown, setCountdown] = useState(900); // 15 min price lock
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Form fields
  const [formData, setFormData] = useState({
    firstName: 'Jan',
    lastName: 'de Vries',
    email: 'jandevries@example.nl',
    phone: '06 12345678',
    street: 'Keizersgracht 421',
    postalCode: '1016 EK',
    city: 'Amsterdam',
    isFietsplan: false,
    companyName: 'Tech Solutions B.V.',
    notes: 'Graag bellen voor levering'
  });

  // Crypto wallet addresses mock for distributor checkout
  const CRYPTO_WALLETS = {
    BTC: 'bc1q9x37uvh84e9q7df6m6aekn534u8g5970c93r42',
    ETH: '0x71C...8B3428909eAf2c34a1b53B1A2b10',
    USDT: 'TYj23Pqm...8eA9xL7yK6wQ2z'
  };

  useEffect(() => {
    if (paymentMethod === 'crypto') {
      const timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 900));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [paymentMethod]);

  const copyToClipboard = (text: string, type: 'crypto' | 'iban') => {
    navigator.clipboard?.writeText(text);
    if (type === 'crypto') {
      setCryptoAddressCopied(true);
      setTimeout(() => setCryptoAddressCopied(false), 2000);
    } else {
      setIbanCopied(true);
      setTimeout(() => setIbanCopied(false), 2000);
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const generatedId = `EBK-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      setOrderId(generatedId);
      setIsSubmitting(false);
      setOrderConfirmed(true);
      onOrderComplete();
    }, 1200);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-slate-900">
              {orderConfirmed ? 'Bestelbevestiging' : 'Veilig Afrekenen'}
            </span>
            <span className="text-xs text-slate-500">· E-BIKE-TEKOOP.NL</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 flex-1">
          {orderConfirmed ? (
            <div className="text-center py-8 max-w-lg mx-auto space-y-5">
              <div className="w-16 h-16 bg-emerald-100 text-[#00b67a] rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Hartelijk dank voor je bestelling!
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Je bestelnummer is <strong className="text-slate-900 font-mono">{orderId}</strong>.
                  We hebben een bevestiging en officiële BTW-factuur gestuurd naar <strong>{formData.email}</strong>.
                </p>
              </div>

              {/* Order Info Card */}
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-3">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Gekozen betaalmethode:</span>
                  <span className="font-semibold text-slate-900 uppercase">
                    {paymentMethod === 'ideal' ? 'iDEAL' : paymentMethod === 'bank' ? 'SEPA Bankoverschrijving' : `Crypto (${cryptoAsset})`}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Afleveradres:</span>
                  <span className="font-semibold text-slate-900 text-right">
                    {formData.street}, {formData.postalCode} {formData.city}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Bezorging:</span>
                  <span className="text-emerald-700 font-semibold">
                    100% Rijklaar aan huis (koerier belt 30 min van tevoren)
                  </span>
                </div>
                <div className="flex justify-between pt-1 font-bold text-sm">
                  <span>Totaalbedrag voldaan:</span>
                  <span className="text-blue-700">{formatEur(totalEur)}</span>
                </div>
              </div>

              {/* Trustpilot Review Invitation snippet */}
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200/80 text-xs text-left">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <span className="text-[#00b67a]">★ Trustpilot</span>
                  <span>Jouw mening telt!</span>
                </div>
                <p className="text-slate-600">
                  Zodra je fiets is bezorgd ontvang je een uitnodiging om een korte Trustpilot review te plaatsen over de levering.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-center gap-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 transition-colors"
                >
                  Terug naar winkel
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Customer details & Payment Options (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                {/* 1. Klantgegevens */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                    1. Bezorggegevens & Factuuradres
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-600 mb-1">Voornaam *</label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1">Achternaam *</label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1">E-mailadres *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1">Telefoonnummer (voor bezorgafspraak) *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-slate-600 mb-1">Straat en huisnummer *</label>
                      <input
                        type="text"
                        required
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1">Postcode *</label>
                      <input
                        type="text"
                        required
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1">Woonplaats *</label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  {/* Fietsplan checkbox */}
                  <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                      <input
                        type="checkbox"
                        checked={formData.isFietsplan}
                        onChange={(e) => setFormData({ ...formData, isFietsplan: e.target.checked })}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>Aankoop via Fietsplan / Werkkostenregeling (WKR factuur)</span>
                    </label>

                    {formData.isFietsplan && (
                      <div className="mt-2 pt-2 border-t border-slate-200">
                        <label className="block text-slate-600 mb-1">Bedrijfsnaam / Werkgever</label>
                        <input
                          type="text"
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                          className="w-full p-2 rounded border border-slate-200 text-xs bg-white"
                          placeholder="Bijv. Bedrijfsnaam B.V."
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Betaalmethode Keuze (iDEAL + Bankoverschrijving + Crypto) */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                    2. Betaalmethode (Prijzen incl. 21% BTW)
                  </h3>

                  <div className="space-y-3">
                    {/* iDEAL Option */}
                    <div
                      onClick={() => setPaymentMethod('ideal')}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition-colors ${
                        paymentMethod === 'ideal'
                          ? 'border-blue-600 bg-blue-50/40'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <CreditCard className="w-5 h-5 text-pink-600" />
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">
                            iDEAL (Direct via je eigen bank)
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-pink-700 bg-pink-100 px-2 py-0.5 rounded">
                          Meest gekozen
                        </span>
                      </div>

                      {paymentMethod === 'ideal' && (
                        <div className="mt-3 pt-3 border-t border-blue-200/60">
                          <label className="block text-xs text-slate-600 mb-1">
                            Selecteer je bank:
                          </label>
                          <select
                            value={selectedBank}
                            onChange={(e) => setSelectedBank(e.target.value)}
                            className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                          >
                            <option value="rabobank">Rabobank</option>
                            <option value="ing">ING</option>
                            <option value="abnamro">ABN AMRO</option>
                            <option value="sns">SNS Bank</option>
                            <option value="asn">ASN Bank</option>
                            <option value="regiobank">RegioBank</option>
                            <option value="bunq">bunq</option>
                            <option value="knab">Knab</option>
                            <option value="revolut">Revolut</option>
                          </select>
                        </div>
                      )}
                    </div>

                    {/* SEPA Bankoverschrijving Option */}
                    <div
                      onClick={() => setPaymentMethod('bank')}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition-colors ${
                        paymentMethod === 'bank'
                          ? 'border-blue-600 bg-blue-50/40'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <Building className="w-5 h-5 text-blue-700" />
                          <div>
                            <span className="font-bold text-slate-900 text-xs sm:text-sm block">
                              SEPA Bankoverschrijving (Vooraf overboeken)
                            </span>
                            <span className="text-[11px] text-slate-500">
                              Ideaal voor zakelijke betalingen en Fietsplan declaraties
                            </span>
                          </div>
                        </div>
                      </div>

                      {paymentMethod === 'bank' && (
                        <div className="mt-3 pt-3 border-t border-blue-200/60 text-xs space-y-2 bg-white p-3 rounded-lg border border-slate-200">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500">IBAN Rekeningnummer:</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-slate-900">
                                NL91 ABNA 0412 3456 78
                              </span>
                              <button
                                type="button"
                                onClick={() => copyToClipboard('NL91ABNA0412345678', 'iban')}
                                className="p-1 hover:bg-slate-100 rounded text-slate-500"
                                title="Kopieer IBAN"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          {ibanCopied && (
                            <span className="text-[10px] text-emerald-600 block text-right">
                              ✓ IBAN gekopieerd naar klembord
                            </span>
                          )}
                          <div className="flex justify-between">
                            <span className="text-slate-500">Ten name van:</span>
                            <span className="font-semibold text-slate-900">E-BIKE-TEKOOP.NL B.V.</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Betalingskenmerk:</span>
                            <span className="font-mono text-slate-900 font-bold">ORD-2026-LIVE</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Crypto Payment Option */}
                    <div
                      onClick={() => setPaymentMethod('crypto')}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition-colors ${
                        paymentMethod === 'crypto'
                          ? 'border-amber-500 bg-amber-50/40'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <Coins className="w-5 h-5 text-amber-500" />
                          <div>
                            <span className="font-bold text-slate-900 text-xs sm:text-sm block">
                              Crypto Betaling (Bitcoin, Ethereum, USDT)
                            </span>
                            <span className="text-[11px] text-slate-500">
                              Directe wallet-naar-wallet betaling via distributeurs gateway
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                          Live Koers
                        </span>
                      </div>

                      {paymentMethod === 'crypto' && (
                        <div className="mt-3 pt-3 border-t border-amber-200/60 space-y-3 bg-white p-3 rounded-lg border border-slate-200 text-xs">
                          {/* Asset switch */}
                          <div className="flex items-center justify-between">
                            <span className="text-slate-600 font-medium">Kies cryptocurrency:</span>
                            <div className="flex items-center gap-1">
                              {(['BTC', 'ETH', 'USDT'] as const).map((coin) => (
                                <button
                                  key={coin}
                                  type="button"
                                  onClick={() => setCryptoAsset(coin)}
                                  className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                                    cryptoAsset === coin
                                      ? 'bg-amber-500 text-white'
                                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                  }`}
                                >
                                  {coin}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Calculated Amount & Rate */}
                          <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between font-mono">
                            <div>
                              <div className="text-[11px] text-slate-500">Te voldoen bedrag:</div>
                              <div className="text-base font-bold text-slate-900">
                                {eurToCrypto(totalEur, cryptoAsset)} {cryptoAsset}
                              </div>
                            </div>
                            <div className="text-right text-[11px] text-slate-500">
                              <div className="flex items-center gap-1 text-amber-600 font-semibold">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Koers vast: {formatSeconds(countdown)}</span>
                              </div>
                              <div>= {formatEur(totalEur)}</div>
                            </div>
                          </div>

                          {/* Address & QR */}
                          <div className="space-y-1">
                            <label className="block text-[11px] text-slate-500">
                              Stortingsadres ({cryptoAsset}):
                            </label>
                            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded border border-slate-200 font-mono text-[11px] break-all">
                              <span className="flex-1 text-slate-800">{CRYPTO_WALLETS[cryptoAsset]}</span>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(CRYPTO_WALLETS[cryptoAsset], 'crypto')}
                                className="p-1 hover:bg-slate-200 rounded text-slate-600 shrink-0"
                                title="Kopieer adres"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                            {cryptoAddressCopied && (
                              <span className="text-[10px] text-emerald-600 block">
                                ✓ Adres gekopieerd naar klembord
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Order Summary (5 cols) */}
              <div className="lg:col-span-5 space-y-5 bg-slate-50 p-5 rounded-xl border border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Overzicht Bestelling ({items.length})
                </h3>

                <div className="divide-y divide-slate-200 max-h-56 overflow-y-auto pr-1">
                  {items.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900 line-clamp-1">
                          {item.product.brand} {item.product.model}
                        </div>
                        <div className="text-slate-500 text-[11px]">
                          Maat {item.selectedFramemaat} · {item.quantity}x
                        </div>
                      </div>
                      <span className="font-bold tabular-nums text-slate-900">
                        {formatEur(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-200 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotaal excl. BTW:</span>
                    <span className="tabular-nums font-mono">{formatEur(exclVat)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>21% BTW:</span>
                    <span className="tabular-nums font-mono">{formatEur(vatAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>100% Rijklaar bezorging:</span>
                    <span className="text-emerald-700 font-bold">Gratis</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                    <span>Totaal incl. BTW:</span>
                    <span className="tabular-nums">{formatEur(totalEur)}</span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
                >
                  {isSubmitting ? (
                    <span>Bestelling wordt verwerkt...</span>
                  ) : (
                    <>
                      <span>Bestelling Plaatsen & Betalen</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Trust guarantees */}
                <div className="p-3 bg-white rounded-lg border border-slate-200/80 text-[11px] text-slate-500 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Officiële fabrieksgarantie via Nederlandse distributeur</span>
                  </div>
                  <div>✓ 14 dagen wettelijk bedenkrecht</div>
                  <div>✓ Beoordeeld met een 4.8 / 5 op Trustpilot</div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
