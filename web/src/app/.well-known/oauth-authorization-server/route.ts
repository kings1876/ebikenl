import { oauthAuthorizationServer } from '@/lib/agentFiles';

export const dynamic = 'force-static';

export function GET() {
  return new Response(JSON.stringify(oauthAuthorizationServer(), null, 2), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=3600' } });
}
