'use client';

import { useId, useRef } from 'react';
import type { ElementType, ReactNode } from 'react';

/**
 * Text and links that never change after the server rendered them (footer, guide text, model index, FAQ).
 * On the first page load the browser keeps the server's HTML as it is instead of rebuilding and checking every node of it
 * in the hydration pass, which is main-thread time a stateless block does not need. Their links are plain links that
 * load the next page normally. When such a block is created later in the browser (a soft navigation, no server HTML), it
 * renders its children as usual.
 */
export function StaticHtml({ as, className, children }: { as?: ElementType; className?: string; children: ReactNode }) {
  const Tag: ElementType = as ?? 'div';
  const id = useId();
  const keep = useRef<boolean | null>(null);
  // Decided once per block: is there already server-rendered HTML with this id in the page?
  if (keep.current === null) keep.current = typeof document !== 'undefined' && document.getElementById(id) !== null;
  if (keep.current) return <Tag id={id} className={className} dangerouslySetInnerHTML={{ __html: '' }} suppressHydrationWarning />;
  return (
    <Tag id={id} className={className}>
      {children}
    </Tag>
  );
}
