// Which products a landing page lists. Shared by the server (first page of results) and the client view (full list).
import type { LandingPageDef } from '@/data/ebikes';
import type { ProductCardData } from '@/types/ebike';

export function matchesLanding(p: ProductCardData, landing: LandingPageDef): boolean {
  if (landing.priceMax && (p.price ?? 0) > landing.priceMax) return false;
  if (landing.matchFilter.motormerk && p.motormerk !== landing.matchFilter.motormerk) return false;
  if (landing.matchFilter.motorpositie && p.motorpositie !== landing.matchFilter.motorpositie) return false;
  if (landing.matchFilter.doelgroep && p.doelgroep !== landing.matchFilter.doelgroep) return false;
  if (landing.matchFilter.maximaleSnelheid && p.maximaleSnelheid !== landing.matchFilter.maximaleSnelheid) return false;
  return true;
}
