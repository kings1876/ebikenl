'use client';

/**
 * Thin adapter so components ported from the react-router prototype keep working on Next.js.
 * Also makes every internal link and navigation locale-aware (English lives under /en).
 */
import NextLink from 'next/link';
import {
  useParams as useNextParams,
  usePathname,
  useRouter,
  useSearchParams as useNextSearchParams,
} from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import type { ComponentProps } from 'react';
import { stripLocale, withLocale } from '@/i18n/config';
import { useLocale } from '@/i18n/locale';

type LinkProps = Omit<ComponentProps<typeof NextLink>, 'href'> & { to: string };

export function Link({ to, ...rest }: LinkProps) {
  const locale = useLocale();
  return <NextLink href={withLocale(to, locale)} {...rest} />;
}

const STATE_KEY = 'ebt:nav-state';

export function useNavigate() {
  const router = useRouter();
  const locale = useLocale();
  return useCallback(
    (to: string, opts?: { state?: unknown }) => {
      try {
        if (opts?.state !== undefined) {
          sessionStorage.setItem(STATE_KEY, JSON.stringify({ to, state: opts.state }));
        }
      } catch {
        /* storage unavailable: navigation still works, just without state */
      }
      router.push(withLocale(to, locale));
    },
    [router, locale],
  );
}

export function useLocation() {
  const pathname = stripLocale(usePathname());
  const [state, setState] = useState<unknown>(undefined);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STATE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { to: string; state: unknown };
        if (saved.to === pathname) setState(saved.state);
      }
    } catch {
      /* ignore */
    }
  }, [pathname]);
  return { pathname, state };
}

export function useParams<T extends Record<string, string | undefined>>() {
  return useNextParams() as unknown as T;
}

export function useSearchParams(): [
  URLSearchParams,
  (next: Record<string, string>) => void,
] {
  const params = useNextSearchParams();
  const router = useRouter();
  const pathname = usePathname(); // already includes /en when English
  const set = useCallback(
    (next: Record<string, string>) => {
      const qs = new URLSearchParams(next).toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [router, pathname],
  );
  return [new URLSearchParams(params.toString()), set];
}
