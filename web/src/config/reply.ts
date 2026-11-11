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
  /** Discount on the order total when the customer pays in crypto (BTC / USDT). 0.1 = 10%. */
  cryptoDiscount: 0.1,
  brand: { primary: '#2563EB', headerDark: '#0F172A' },
  currency: { code: 'EUR', symbol: '€', locale: 'nl-NL' },
  channels: {
    /** Where orders and enquiries arrive and where customers can reply. */
    email: 'verkoop@e-bike-tekoop.nl',
    /** Digits with country code, e.g. '31612345678'. Empty = WhatsApp features stay hidden. */
    whatsapp: '',
  },
  headerTagline: { nl: 'Nieuwe elektrische fietsen', en: 'New electric bikes' } satisfies Bilingual,
  dispatchLine: {
    nl: 'Levertijd en eventuele verzendkosten bevestigen we per e-mail zodra je betaling binnen is.',
    en: 'We confirm delivery time and any shipping costs by email as soon as your payment has arrived.',
  } satisfies Bilingual,
  /** Receiving addresses for crypto orders. The admin composer pre-fills these; the customer gets them by email after ordering. */
  cryptoWallets: [
    { id: 'btc', label: 'Bitcoin (BTC)', address: 'bc1qzn330nvevy8l2phf2swc25znd8ct6ju9gdprl7', network: 'Bitcoin' },
    { id: 'usdt', label: 'USDT', address: 'TBnrAF6yjaYyUBXFGDzDUdkUG7EZr6qrFN', network: 'Tron (TRC-20)' },
    { id: 'eth', label: 'Ethereum (ETH)', address: '0x71e590e953d8DBf7a2d8a4Fa58Ea55c3c57A6f8C', network: 'Ethereum' },
  ],
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
      label: { nl: 'Crypto (BTC / USDT / ETH)', en: 'Crypto (BTC / USDT / ETH)' },
      opening: {
        nl: 'Betaal {amount} (incl. crypto-korting, omgerekend naar Bitcoin, USDT of Ethereum) naar onderstaand adres op het genoemde netwerk. Vermeld ordernummer {ref} in je bericht aan ons.',
        en: 'Pay {amount} (incl. crypto discount, converted to Bitcoin, USDT or Ethereum) to the address below on the stated network. Quote order number {ref} in your message to us.',
      },
      closing: {
        nl: 'Controleer adres en netwerk zorgvuldig: een transactie is niet terug te draaien.',
        en: 'Check the address and network carefully: a transaction cannot be reversed.',
      },
    },
  ] satisfies PaymentMethod[],
} as const;

export const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? `https://${REPLY.domain}`;
