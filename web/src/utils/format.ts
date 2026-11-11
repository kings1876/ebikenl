import { REPLY } from '@/config/reply';

export const CRYPTO_DISCOUNT_PCT = Math.round(REPLY.cryptoDiscount * 100);

/** Price when paying in crypto (BTC / USDT), after the crypto discount. */
export const cryptoPrice = (eur: number): number => Math.round(eur * (1 - REPLY.cryptoDiscount) * 100) / 100;

export function formatEur(amount: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatEurWithCents(amount: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

// Approximate crypto conversion rates for live EUR display
export const CRYPTO_RATES = {
  BTC: 84500, // 1 BTC = €84.500
  ETH: 3100,  // 1 ETH = €3.100
  USDT: 0.95  // 1 USDT = €0.95
};

export function eurToCrypto(eur: number, crypto: 'BTC' | 'ETH' | 'USDT'): string {
  const rate = CRYPTO_RATES[crypto];
  const value = eur / rate;
  if (crypto === 'BTC') {
    return value.toFixed(6);
  }
  if (crypto === 'ETH') {
    return value.toFixed(4);
  }
  return value.toFixed(2);
}

export function calculateVat(totalInclVat: number, vatRate = 0.21) {
  const exclVat = totalInclVat / (1 + vatRate);
  const vatAmount = totalInclVat - exclVat;
  return {
    exclVat,
    vatAmount,
    totalInclVat
  };
}
