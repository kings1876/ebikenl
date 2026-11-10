'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from '@/lib/router';
import { useShop } from '../context/ShopContext';
import { formatEur, eurToCrypto, calculateVat } from '../utils/format';
import { Breadcrumbs } from '../components/Breadcrumbs';
import {
  CreditCard,
  Building,
  Coins,
  Copy,
  Clock,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { useTr } from '@/i18n/locale';

export const CheckoutPage: React.FC = () => {
  const tr = useTr();

  const { cart, cartTotal, clearCart } = useShop();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { exclVat, vatAmount } = calculateVat(cartTotal);

  const [paymentMethod, setPaymentMethod] = useState<'ideal' | 'bank' | 'crypto'>('ideal');
  const [selectedBank, setSelectedBank] = useState<string>('rabobank');
  const [cryptoAsset, setCryptoAsset] = useState<'BTC' | 'ETH' | 'USDT'>('BTC');
  const [cryptoAddressCopied, setCryptoAddressCopied] = useState(false);
  const [ibanCopied, setIbanCopied] = useState(false);
  const [countdown, setCountdown] = useState(900);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Customer shipping details
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const orderId = `EBK-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      clearCart();
      setIsSubmitting(false);
      navigate(`/bestelling-bevestigd/${orderId}`, {
        state: {
          formData,
          paymentMethod,
          cryptoAsset,
          cartTotal,
          itemsCount: cart.length
        }
      });
    }, 1000);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{tr("Geen artikelen om af te rekenen")}</h1>
        <p className="text-slate-600 mb-6">{tr("Je winkelwagen is leeg. Voeg eerst een e-bike toe aan je winkelwagen.")}</p>
        <Link
          to="/categorie/elektrische-fietsen"
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm inline-flex items-center gap-2 hover:bg-blue-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{tr("Bekijk alle e-bikes")}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Winkelwagen', path: '/winkelwagen' },
          { label: 'Afrekenen' }
        ]}
      />

      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
          {tr("Veilig Afrekenen")}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {tr("Nederlandse webshop · Prijzen incl. 21% BTW · 100% Rijklaar bezorgd aan huis")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Details & Payment (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Klant & Bezorgadres */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {tr("1. Bezorgadres & Klantgegevens")}
            </h2>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1">{tr("Voornaam *")}</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">{tr("Achternaam *")}</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">{tr("E-mailadres (voor factuur) *")}</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">{tr("Telefoonnummer (voor bezorgafspraak) *")}</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-slate-600 mb-1">{tr("Straat en huisnummer *")}</label>
                <input
                  type="text"
                  required
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">{tr("Postcode *")}</label>
                <input
                  type="text"
                  required
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">{tr("Woonplaats *")}</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Fietsplan toggle */}
            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={formData.isFietsplan}
                  onChange={(e) => setFormData({ ...formData, isFietsplan: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>{tr("Zakelijk Fietsplan (WKR Factuur met bedrijfsvermelding)")}</span>
              </label>

              {formData.isFietsplan && (
                <div className="mt-2.5 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs">
                  <label className="block text-slate-700 mb-1 font-medium">{tr("Bedrijfsnaam / Werkgever")}</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full p-2 rounded-lg border border-amber-300 bg-white"
                    placeholder={tr("Bedrijfsnaam B.V.")}
                  />
                </div>
              )}
            </div>
          </div>

          {/* 2. Betaalmethoden (iDEAL, SEPA, Crypto) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {tr("2. Kies Betaalmethode")}
            </h2>

            <div className="space-y-3">
              {/* iDEAL */}
              <div
                onClick={() => setPaymentMethod('ideal')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                  paymentMethod === 'ideal'
                    ? 'border-blue-600 bg-blue-50/40'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-pink-600" />
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">
                        {tr("iDEAL (Direct via internetbankieren)")}
                      </span>
                      <span className="text-xs text-slate-500">
                        {tr("Veilig, snel en direct bevestigd")}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-pink-700 bg-pink-100 px-2 py-0.5 rounded">
                    {tr("Meest gekozen")}
                  </span>
                </div>

                {paymentMethod === 'ideal' && (
                  <div className="mt-3 pt-3 border-t border-blue-200 text-xs">
                    <label className="block text-slate-600 mb-1.5 font-medium">
                      {tr("Selecteer je bank:")}
                    </label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-200 bg-white font-medium"
                    >
                      <option value="rabobank">{tr("Rabobank")}</option>
                      <option value="ing">{tr("ING")}</option>
                      <option value="abnamro">{tr("ABN AMRO")}</option>
                      <option value="sns">{tr("SNS Bank")}</option>
                      <option value="asn">{tr("ASN Bank")}</option>
                      <option value="regiobank">{tr("RegioBank")}</option>
                      <option value="bunq">{tr("bunq")}</option>
                      <option value="knab">{tr("Knab")}</option>
                      <option value="revolut">{tr("Revolut")}</option>
                    </select>
                  </div>
                )}
              </div>

              {/* SEPA Bankoverschrijving */}
              <div
                onClick={() => setPaymentMethod('bank')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                  paymentMethod === 'bank'
                    ? 'border-blue-600 bg-blue-50/40'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-blue-700" />
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">
                      {tr("SEPA Bankoverschrijving")}
                    </span>
                    <span className="text-xs text-slate-500">
                      {tr("Vooraf overboeken via factuur of internetbankieren")}
                    </span>
                  </div>
                </div>

                {paymentMethod === 'bank' && (
                  <div className="mt-3 pt-3 border-t border-blue-200 text-xs space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">{tr("IBAN:")}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">
                          {tr("NL91 ABNA 0412 3456 78")}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('NL91ABNA0412345678', 'iban')}
                          className="p-1 hover:bg-slate-200 rounded text-slate-600"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    {ibanCopied && (
                      <span className="text-[10px] text-emerald-600 block text-right font-medium">
                        {tr("✓ IBAN gekopieerd")}
                      </span>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-500">{tr("Ten name van:")}</span>
                      <span className="font-bold text-slate-900">{tr("E-BIKE-TEKOOP.NL B.V.")}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Crypto Gateway */}
              <div
                onClick={() => setPaymentMethod('crypto')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                  paymentMethod === 'crypto'
                    ? 'border-amber-500 bg-amber-50/40'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Coins className="w-5 h-5 text-amber-500" />
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">
                        {tr("Crypto Betaling (BTC, ETH, USDT)")}
                      </span>
                      <span className="text-xs text-slate-500">
                        {tr("Live wisselkoers via distributeur gateway")}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    {tr("Web3 Gateway")}
                  </span>
                </div>

                {paymentMethod === 'crypto' && (
                  <div className="mt-3 pt-3 border-t border-amber-200 text-xs space-y-3 bg-white p-3 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 font-medium">{tr("Kies coin:")}</span>
                      <div className="flex items-center gap-1.5">
                        {(['BTC', 'ETH', 'USDT'] as const).map((coin) => (
                          <button
                            key={coin}
                            type="button"
                            onClick={() => setCryptoAsset(coin)}
                            className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                              cryptoAsset === coin
                                ? 'bg-amber-500 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {tr(coin)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between font-mono">
                      <div>
                        <div className="text-[11px] text-slate-500">{tr("Te voldoen bedrag:")}</div>
                        <div className="text-base font-bold text-slate-900">
                          {eurToCrypto(cartTotal, cryptoAsset)} {tr(cryptoAsset)}
                        </div>
                      </div>
                      <div className="text-right text-[11px] text-amber-600 font-semibold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{tr("Koers vast:")} {formatSeconds(countdown)}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">
                        {tr("Stortingsadres (")}{tr(cryptoAsset)}):
                      </label>
                      <div className="flex items-center gap-2 bg-slate-50 p-2 rounded border border-slate-200 font-mono text-[11px] break-all">
                        <span className="flex-1 text-slate-800">{CRYPTO_WALLETS[cryptoAsset]}</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(CRYPTO_WALLETS[cryptoAsset], 'crypto')}
                          className="p-1 hover:bg-slate-200 rounded text-slate-600 shrink-0"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      {cryptoAddressCopied && (
                        <span className="text-[10px] text-emerald-600 block mt-1 font-medium">
                          {tr("✓ Adres gekopieerd")}
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
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 sticky top-24">
          <h2 className="text-base font-bold text-slate-900">{tr("Overzicht Artikelen (")}{tr(cart.length)})</h2>

          <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
            {cart.map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900 line-clamp-1">
                    {tr(item.product.brand)} {tr(item.product.model)}
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    {tr("Maat")} {tr(item.selectedFramemaat)} · {tr(item.quantity)}{tr("x")}
                  </div>
                </div>
                <span className="font-bold tabular-nums text-slate-900">
                  {formatEur((item.product.price ?? 0) * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>{tr("Subtotaal excl. BTW:")}</span>
              <span className="tabular-nums font-mono">{formatEur(exclVat)}</span>
            </div>
            <div className="flex justify-between">
              <span>{tr("21% Nederlandse BTW:")}</span>
              <span className="tabular-nums font-mono">{formatEur(vatAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>{tr("Bezorging & 100% rijklaar:")}</span>
              <span className="text-emerald-700 font-bold">{tr("Gratis")}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
              <span>{tr("Totaal incl. BTW:")}</span>
              <span className="tabular-nums text-blue-700">{formatEur(cartTotal)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
          >
            {isSubmitting ? (
              <span>{tr("Bestelling wordt verwerkt...")}</span>
            ) : (
              <>
                <span>{tr("Bestelling Plaatsen & Betalen")}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{tr("Geverifieerde aankoop met fabrieksgarantie")}</span>
            </div>
            <div>{tr("✓ Beoordeeld met een 4.8 / 5 op Trustpilot")}</div>
          </div>
        </div>
      </form>
    </div>
  );
};
