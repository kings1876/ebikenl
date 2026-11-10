import type { Locale } from './config';
import { EN } from './en';

/**
 * Dutch is the source language: the Dutch text itself is the key.
 * For English we look it up; anything not in the dictionary (brand names, user
 * input, customer reviews, numbers) is returned unchanged.
 */
export function translate<T>(locale: Locale, value: T): T | string {
  if (locale === 'nl' || typeof value !== 'string') return value;
  const key = value.replace(/\s+/g, ' ');
  return EN[key] ?? EN[key.trim()] ?? value;
}
