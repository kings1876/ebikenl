'use client';

import { useSyncExternalStore } from 'react';

const noop = () => () => {};

/** Reads one query-string value in the browser ('' on the server and while hydrating) without needing a Suspense boundary. */
export function useQueryParam(name: string): string {
  const search = useSyncExternalStore(
    noop,
    () => window.location.search,
    () => '',
  );
  return new URLSearchParams(search).get(name) ?? '';
}
