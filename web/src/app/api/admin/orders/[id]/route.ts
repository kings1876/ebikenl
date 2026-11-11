import { checkAdminPasscode } from '@/lib/reply/adminAuth';
import { deleteOrder, getOrder } from '@/lib/reply/orderStore';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Ctx) {
  const denied = checkAdminPasscode(request);
  if (denied) return denied;
  const order = await getOrder(decodeURIComponent((await params).id));
  if (!order) return Response.json({ ok: false, error: 'not-found' }, { status: 404 });
  return Response.json({ ok: true, order }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function DELETE(request: Request, { params }: Ctx) {
  const denied = checkAdminPasscode(request);
  if (denied) return denied;
  await deleteOrder(decodeURIComponent((await params).id));
  return Response.json({ ok: true });
}
