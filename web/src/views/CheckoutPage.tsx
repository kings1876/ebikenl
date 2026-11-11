'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from '@/lib/router';
import { useShop } from '../context/ShopContext';
import { formatEur, formatEurWithCents, calculateVat, CRYPTO_DISCOUNT_PCT } from '../utils/format';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Building, Coins, Mail, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLocale, useTr } from '@/i18n/locale';
import { discountFor, makeOrderNumber } from '@/lib/reply/order';
import { REPLY } from '@/config/reply';

type MethodId = 'bank' | 'crypto';

const METHODS: { id: MethodId; icon: React.ReactNode; title: string; hint: string }[] = [
  { id: 'bank', icon: <Building className="w-5 h-5 text-blue-700" />, title: 'Bankoverschrijving', hint: 'Vooraf overboeken met onze rekeninggegevens' },
  { id: 'crypto', icon: <Coins className="w-5 h-5 text-amber-500" />, title: 'Crypto (BTC / USDT / ETH)', hint: 'Je ontvangt het adres en netwerk per e-mail' },
];

export const CheckoutPage: React.FC = () => {
  const tr = useTr();
  const locale = useLocale();

  const { cart, cartTotal, clearCart } = useShop();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { exclVat, vatAmount } = calculateVat(cartTotal);

  const [paymentMethod, setPaymentMethod] = useState<MethodId>('bank');
  const discount = discountFor(paymentMethod, cartTotal);
  const payable = Math.round((cartTotal - discount) * 100) / 100;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    postalCode: '',
    city: '',
    isFietsplan: false,
    companyName: '',
    notes: '',
    botcheck: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    // The number is minted here (client side) so the same one appears in the dashboard and in every email.
    const orderNumber = makeOrderNumber();
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          formName: 'order',
          locale,
          orderNumber,
          paymentMethod,
          botcheck: formData.botcheck,
          customer: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            street: formData.street,
            postalCode: formData.postalCode,
            city: formData.city,
          },
          isFietsplan: formData.isFietsplan,
          companyName: formData.companyName,
          notes: formData.notes,
          items: cart.map((item) => ({
            id: item.product.id,
            size: item.selectedFramemaat,
            color: item.selectedKleur,
            quantity: item.quantity,
          })),
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      clearCart();
      navigate(`/bestelling-bevestigd/${orderNumber}`, { state: { paymentMethod, cartTotal: payable, email: formData.email } });
    } catch {
      setError(tr('Je bestelling is niet verstuurd. Probeer het opnieuw, of mail ons op') as string);
    }
    setIsSubmitting(false);
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

  const field = 'w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600';
  const set = (key: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [key]: e.target.value });

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
          {tr("Nederlandse webshop · Prijzen incl. 21% BTW")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Klant & Bezorgadres */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {tr("1. Bezorgadres & Klantgegevens")}
            </h2>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label htmlFor="co-first" className="block text-slate-600 mb-1">{tr("Voornaam *")}</label>
                <input id="co-first" type="text" required autoComplete="given-name" value={formData.firstName} onChange={set('firstName')} className={field} />
              </div>
              <div>
                <label htmlFor="co-last" className="block text-slate-600 mb-1">{tr("Achternaam *")}</label>
                <input id="co-last" type="text" required autoComplete="family-name" value={formData.lastName} onChange={set('lastName')} className={field} />
              </div>
              <div>
                <label htmlFor="co-email" className="block text-slate-600 mb-1">{tr("E-mailadres (voor bevestiging en betaalgegevens) *")}</label>
                <input id="co-email" type="email" required autoComplete="email" value={formData.email} onChange={set('email')} className={field} />
              </div>
              <div>
                <label htmlFor="co-phone" className="block text-slate-600 mb-1">{tr("Telefoonnummer (voor bezorgafspraak) *")}</label>
                <input id="co-phone" type="tel" required autoComplete="tel" value={formData.phone} onChange={set('phone')} className={field} />
              </div>
              <div className="col-span-2">
                <label htmlFor="co-street" className="block text-slate-600 mb-1">{tr("Straat en huisnummer *")}</label>
                <input id="co-street" type="text" required autoComplete="street-address" value={formData.street} onChange={set('street')} className={field} />
              </div>
              <div>
                <label htmlFor="co-zip" className="block text-slate-600 mb-1">{tr("Postcode *")}</label>
                <input id="co-zip" type="text" required autoComplete="postal-code" value={formData.postalCode} onChange={set('postalCode')} className={field} />
              </div>
              <div>
                <label htmlFor="co-city" className="block text-slate-600 mb-1">{tr("Woonplaats *")}</label>
                <input id="co-city" type="text" required autoComplete="address-level2" value={formData.city} onChange={set('city')} className={field} />
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
                  <label htmlFor="co-company" className="block text-slate-700 mb-1 font-medium">{tr("Bedrijfsnaam / Werkgever")}</label>
                  <input
                    id="co-company"
                    type="text"
                    autoComplete="organization"
                    value={formData.companyName}
                    onChange={set('companyName')}
                    className="w-full p-2 rounded-lg border border-amber-300 bg-white"
                    placeholder={tr("Bedrijfsnaam B.V.") as string}
                  />
                </div>
              )}
            </div>

            <div className="text-xs">
              <label htmlFor="co-notes" className="block text-slate-600 mb-1">{tr("Opmerking (optioneel)")}</label>
              <input id="co-notes" type="text" maxLength={500} value={formData.notes} onChange={set('notes')} className={field} />
            </div>
          </div>

          {/* 2. Voorkeur betaalmethode */}
          <fieldset className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <legend className="text-sm font-bold text-slate-900 uppercase tracking-wider float-left w-full">
              {tr("2. Kies Betaalmethode")}
            </legend>

            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs text-slate-700 flex items-start gap-2 clear-both">
              <Mail className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>{tr("Je betaalt nog niet op deze pagina. Na je bestelling mailen we je de betaalgegevens voor de gekozen methode. Je bestelling is definitief zodra de betaling is ontvangen.")}</span>
            </div>

            <div className="space-y-3">
              {METHODS.map((m) => (
                <label
                  key={m.id}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                    paymentMethod === m.id ? 'border-blue-600 bg-blue-50/40' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input type="radio" name="payment" value={m.id} checked={paymentMethod === m.id} onChange={() => setPaymentMethod(m.id)} className="sr-only" />
                  {m.icon}
                  <span>
                    <span className="font-bold text-slate-900 text-sm block">{tr(m.title)}{m.id === 'crypto' && <span className="ml-2 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 align-middle">-{CRYPTO_DISCOUNT_PCT}%</span>}</span>
                    <span className="text-xs text-slate-500">{tr(m.hint)}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {/* Right Column: Order Summary (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 lg:sticky lg:top-24">
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
            <div className="flex justify-between gap-4">
              <span>{tr("Verzendkosten en levertijd:")}</span>
              <span className="text-slate-700 font-semibold text-right">{tr("bevestigen we per e-mail")}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>{tr("Crypto-korting")} ({CRYPTO_DISCOUNT_PCT}%):</span>
                <span className="tabular-nums font-mono">-{formatEurWithCents(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
              <span>{tr("Totaal incl. BTW:")}</span>
              <span className="tabular-nums text-blue-700">{discount > 0 ? formatEurWithCents(payable) : formatEur(payable)}</span>
            </div>
          </div>

          {/* honeypot: hidden from people, filled in by simple bots */}
          <input tabIndex={-1} autoComplete="off" aria-hidden="true" value={formData.botcheck} onChange={set('botcheck')} className="hidden" name="botcheck" />

          {error && (
            <p role="alert" className="text-xs text-red-600">
              {error} <a className="underline font-semibold" href={`mailto:${REPLY.channels.email}`}>{REPLY.channels.email}</a>
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
          >
            {isSubmitting ? (
              <span>{tr("Bestelling wordt verwerkt...")}</span>
            ) : (
              <>
                <span>{tr("Bestelling plaatsen")}</span>
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
