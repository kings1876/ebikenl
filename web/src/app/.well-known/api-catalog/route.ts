import { apiCatalog } from '@/lib/agentFiles';

export const dynamic = 'force-static';

export function GET() {
  return new Response(JSON.stringify(apiCatalog(), null, 2), { headers: { 'Content-Type': 'application/linkset+json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=3600' } });
}
