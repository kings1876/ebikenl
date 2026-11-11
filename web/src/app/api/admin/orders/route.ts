import { checkAdminPasscode } from '@/lib/reply/adminAuth';
import { isOrderStoreConfigured, listOrders } from '@/lib/reply/orderStore';

export async function GET(request: Request) {
  const denied = checkAdminPasscode(request);
  if (denied) return denied;
  const configured = isOrderStoreConfigured();
  return Response.json({ ok: true, configured, orders: configured ? await listOrders() : [] }, { headers: { 'Cache-Control': 'no-store' } });
}
