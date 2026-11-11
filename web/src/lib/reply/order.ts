// Client-safe helpers shared by checkout, the API routes, the emails and the admin pages.
import { REPLY } from '@/config/reply';
import type { PaymentMethod } from '@/config/reply';
import type { Locale } from '@/i18n/config';
import type { PaymentField } from './types';

/** Crypto discount for a given payment method and subtotal, rounded to cents. 0 for every other method. */
export const discountFor = (methodId: string, subtotal: number): number =>
  methodId === 'crypto' ? Math.round(subtotal * REPLY.cryptoDiscount * 100) / 100 : 0;

export const ORDER_REF_RE = new RegExp(`^${REPLY.orderPrefix}-[A-Z0-9]{4,8}$`);

/**
 * Minted in the browser at submit time so the same number appears in the dashboard and in every email.
 * The alphabet has no 0/O/1/I/L so a number read off a screenshot or over the phone cannot be misread.
 */
export function makeOrderNumber(): string {
  const t = Date.now().toString(36).toUpperCase().slice(-4);
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(2));
  let r = '';
  for (const b of bytes) r += alphabet[b % alphabet.length];
  return `${REPLY.orderPrefix}-${t.replace(/[01OIL]/g, 'X')}${r}`;
}

export function money(amount: number, locale: Locale = 'nl'): string {
  return new Intl.NumberFormat(locale === 'en' ? 'en-GB' : REPLY.currency.locale, {
    style: 'currency',
    currency: REPLY.currency.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

const KNOWN_LABELS = [
  'account name', 'account number', 'sort code', 'bank name', 'branch code', 'routing number',
  'beneficiary name', 'beneficiary', 'swift code', 'swift', 'bic code', 'bic', 'iban',
  'wallet address', 'wallet', 'network', 'memo', 'destination tag', 'tag',
  'rekeninghouder', 'rekeningnummer', 'tenaamstelling', 'ten name van', 'betaallink', 'betalingskenmerk', 'kenmerk', 'netwerk',
  'payment link', 'reference',
].sort((a, b) => b.length - a.length); // longest phrase wins, e.g. "account number" over "account"

const LABEL_PATTERN = new RegExp(
  `^(${KNOWN_LABELS.map((l) => l.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\s*[:\\-]?\\s+(.+)$`,
  'i',
);

const titleCase = (s: string) => s.replace(/\S+/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());

/**
 * Splits one pasted blob of payment details into individually copyable fields. Three tiers:
 * 1. "Label: value" on a line (any label works, so a new payment rail needs no code change)
 * 2. no colon, but the line starts with a known label word
 * 3. neither: the whole line becomes "Detail" (numbered when there are several), so a bare wallet address still gets a copy button
 */
export function parsePaymentDetail(text: string): PaymentField[] {
  // A bare "Label:" with nothing after it (e.g. an unfilled "Amount:") is dropped rather than shown as an empty field.
  const lines = String(text || '').split('\n').map((l) => l.trim()).filter((l) => l && !/^[^:]+:$/.test(l));
  let unlabeled = 0;
  return lines.map((line) => {
    const colonIdx = line.indexOf(':');
    // A colon that belongs to a URL scheme ("https://…") is not a label separator.
    if (colonIdx > 0 && colonIdx < line.length - 1 && !line.startsWith('://', colonIdx)) {
      return { label: line.slice(0, colonIdx).trim(), value: line.slice(colonIdx + 1).trim() };
    }
    const match = line.match(LABEL_PATTERN);
    if (match) return { label: titleCase(match[1]), value: match[2].trim() };
    unlabeled += 1;
    return { label: unlabeled > 1 ? `Detail ${unlabeled}` : 'Detail', value: line };
  });
}

export const findMethod = (id: string): PaymentMethod | undefined => REPLY.paymentMethods.find((m) => m.id === id);

export function methodLabel(id: string, locale: Locale = 'nl'): string {
  return findMethod(id)?.label[locale] ?? id;
}

const fill = (tpl: string, amount: string, ref: string) => tpl.replace('{amount}', amount).replace('{ref}', ref);

export function paymentMethodParts(methodId: string, amount: number, ref: string, locale: Locale = 'nl') {
  const m = findMethod(methodId);
  const amt = money(amount, locale);
  return {
    opening: m ? fill(m.opening[locale], amt, ref) : '',
    closing: m ? m.closing[locale] : '',
  };
}

/** Single source for the standing payment terms: the email, the customer page and the composer preview all render these lines. */
export function paymentTermsLines(ref: string, locale: Locale = 'nl'): string[] {
  return locale === 'en'
    ? [
        'This order is confirmed once payment has been received; it is not final before that.',
        `Use your order number ${ref} as the payment reference.`,
        REPLY.dispatchLine.en,
      ]
    : [
        'Je bestelling is definitief zodra de betaling is ontvangen.',
        `Gebruik je ordernummer ${ref} als betaalkenmerk.`,
        REPLY.dispatchLine.nl,
      ];
}
