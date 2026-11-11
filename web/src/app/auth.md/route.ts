import { authMd } from '@/lib/agentFiles';

export const dynamic = 'force-static';

export function GET() {
  return new Response(authMd(), { headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=3600' } });
}
