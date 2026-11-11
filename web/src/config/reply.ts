// Single source of truth for the order/enquiry reply system (Reply Portal).
// Brand, currency, channels and payment methods all live here; nothing else hardcodes them.
// Real payment details (IBAN, payment links, wallet addresses) are NEVER stored here: the operator pastes them per order in /admin.
import type { Locale } from '@/i18n/config';

export type Bilingual = Record<Locale, string>;

export interface PaymentMethod {
  id: string;
  label: Bilingual;
  /** Sentence before the pasted details. Tokens: {amount} {ref} */
  opening: Bilingual;
  /** Sentence after the pasted details. */
  closing: Bilingual;
}

export const REPLY = {
  siteName: 'E-BIKE-TEKOOP.NL',
  domain: 'e-bike-tekoop.nl',
  /** Order numbers look like EBT-K3P9QX; also namespaces the Redis keys. */
  orderPrefix: 'EBT',
  brand: { primary: '#2563EB', headerDark: '#0F172A' },
  currency: { code: 'EUR', symbol: '€', locale: 'nl-NL' },
  channels: {
    /** Where orders and enquiries arrive and where customers can reply. */
    email: 'verkoop@e-bike-tekoop.nl',
    phone: '085 - 200 78 90',
    /** Digits with country code, e.g. '31612345678'. Empty = WhatsApp features stay hidden. */
    whatsapp: '',
  },
  headerTagline: { nl: 'Nieuwe elektrische fietsen', en: 'New electric bikes' } satisfies Bilingual,
  dispatchLine: {
    nl: 'Levertijd en eventuele verzendkosten bevestigen we per e-mail zodra je betaling binnen is.',
    en: 'We confirm delivery time and any shipping costs by email as soon as your payment has arrived.',
  } satisfies Bilingual,
  paymentMethods: [
    {
      id: 'ideal',
      label: { nl: 'iDEAL (betaallink)', en: 'iDEAL (payment link)' },
      opening: {
        nl: 'Betaal {amount} via iDEAL met onderstaande betaallink en vermeld ordernummer {ref}.',
        en: 'Pay {amount} via iDEAL using the payment link below and quote order number {ref}.',
      },
      closing: {
        nl: 'Zodra we je betaling zien, bevestigen we je bestelling per e-mail.',
        en: 'As soon as we see your payment, we confirm your order by email.',
      },
    },
    {
      id: 'bank',
      label: { nl: 'SEPA bankoverschrijving', en: 'SEPA bank transfer' },
      opening: {
        nl: 'Maak {amount} over naar onderstaande rekening en vermeld ordernummer {ref} als betaalkenmerk.',
        en: 'Transfer {amount} to the account below and use order number {ref} as the payment reference.',
      },
      closing: {
        nl: 'Zodra de betaling is bijgeschreven, bevestigen we je bestelling per e-mail.',
        en: 'Once the payment is credited, we confirm your order by email.',
      },
    },
    {
      id: 'crypto',
      label: { nl: 'Crypto (BTC / ETH / USDT)', en: 'Crypto (BTC / ETH / USDT)' },
      opening: {
        nl: 'Betaal het bedrag van {amount} (omgerekend) naar onderstaand adres op het genoemde netwerk. Vermeld ordernummer {ref} in je bericht aan ons.',
        en: 'Pay the amount of {amount} (converted) to the address below on the stated network. Quote order number {ref} in your message to us.',
      },
      closing: {
        nl: 'Controleer adres en netwerk zorgvuldig: een transactie is niet terug te draaien.',
        en: 'Check the address and network carefully: a transaction cannot be reversed.',
      },
    },
  ] satisfies PaymentMethod[],
} as const;

export const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? `https://${REPLY.domain}`;
