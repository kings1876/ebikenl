'use client';

import dynamic from 'next/dynamic';
import { useShop } from '@/context/ShopContext';

// The drawer's code is only downloaded the first time someone opens the cart.
const CartDrawer = dynamic(() => import('./CartDrawer').then((m) => m.CartDrawer), { ssr: false });

export function LazyCartDrawer() {
  const { isCartDrawerOpen } = useShop();
  return isCartDrawerOpen ? <CartDrawer /> : null;
}
