'use client';

import { useEffect, useState } from 'react';
import type { ProductCardData } from '@/types/ebike';

/**
 * The full slim catalogue, loaded on demand instead of being part of the page's JavaScript.
 * Returns null until it has arrived; listing views show the products the server already rendered until then, so first paint
 * (and what search engines see) is unchanged and the ~250 KB stays out of the critical path.
 *
 * It starts loading on the first tap or key press (about to use a filter, the sort or the pager), or after 6 seconds of
 * idle time, so the re-render it triggers does not compete with the page becoming interactive.
 */
const EVENTS = ['pointerdown', 'keydown', 'touchstart'] as const;
const IDLE_MS = 6000;

export function useCatalog(): ProductCardData[] | null {
  const [catalog, setCatalog] = useState<ProductCardData[] | null>(null);
  useEffect(() => {
    let alive = true;
    let started = false;
    const load = () => {
      if (started) return;
      started = true;
      cleanup();
      import('@/data/slim').then((m) => {
        if (alive) setCatalog(m.CARD_PRODUCTS);
      });
    };
    const timer = window.setTimeout(() => ('requestIdleCallback' in window ? window.requestIdleCallback(load, { timeout: 2000 }) : load()), IDLE_MS);
    for (const e of EVENTS) window.addEventListener(e, load, { passive: true, once: true });
    function cleanup() {
      window.clearTimeout(timer);
      for (const e of EVENTS) window.removeEventListener(e, load);
    }
    return () => {
      alive = false;
      cleanup();
    };
  }, []);
  return catalog;
}
