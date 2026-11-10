'use client';

/**
 * Thin adapter so components ported from the react-router prototype keep working on Next.js.
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

type LinkProps = Omit<ComponentProps<typeof NextLink>, 'href'> & { to: string };

export function Link({ to, ...rest }: LinkProps) {
  return <NextLink href={to} {...rest} />;
}

const STATE_KEY = 'ebt:nav-state';

export function useNavigate() {
  const router = useRouter();
  return useCallback(
    (to: string, opts?: { state?: unknown }) => {
      try {
        if (opts?.state !== undefined) {
          sessionStorage.setItem(STATE_KEY, JSON.stringify({ to, state: opts.state }));
        }
      } catch {
        /* storage unavailable: navigation still works, just without state */
      }
      router.push(to);
    },
    [router],
  );
}

export function useLocation() {
  const pathname = usePathname();
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
  const pathname = usePathname();
  const set = useCallback(
    (next: Record<string, string>) => {
      const qs = new URLSearchParams(next).toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [router, pathname],
  );
  return [new URLSearchParams(params.toString()), set];
}
