// Shared by server and client listing code (kept free of data imports and of 'use client').
import type { ProductCardData } from '@/types/ebike';

// 12 cards per page: half the DOM to build and hydrate on listing pages. Every model also has a plain link in the model index below the list.
export const PAGE_SIZE = 12;

/** Default order of the category view: most reviewed first (a stable sort keeps catalogue order for ties). */
export const byPopularity = (a: ProductCardData, b: ProductCardData) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0);
