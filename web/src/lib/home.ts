// The six products featured on the homepage. Computed on the server so the client never downloads the whole catalogue for it.
import { CARD_PRODUCTS } from '@/data/slim';

export const featuredHomeProducts = () =>
  CARD_PRODUCTS.filter((p) => p.category === 'Elektrische fietsen')
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
    .slice(0, 6);
