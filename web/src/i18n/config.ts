export type Locale = 'nl' | 'en';

export const DEFAULT_LOCALE: Locale = 'nl';

/** Dutch lives at the root, English under /en. */
export const localePrefix = (locale: Locale) => (locale === 'en' ? '/en' : '');

export function stripLocale(pathname: string): string {
  if (pathname === '/en') return '/';
  return pathname.startsWith('/en/') ? pathname.slice(3) : pathname;
}

export function withLocale(path: string, locale: Locale): string {
  if (locale !== 'en') return path;
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  if (path === '/en' || path.startsWith('/en/') || path.startsWith('/en?')) return path;
  return path === '/' ? '/en' : `/en${path}`;
}
