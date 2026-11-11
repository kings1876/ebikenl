// Public: the order number is the access token. Returns only what the customer's own payment email already contained.
import { ORDER_REF_RE, paymentTermsLines } from '@/lib/reply/order';
import { getOrder } from '@/lib/reply/orderStore';

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get('id') ?? '';
  if (!ORDER_REF_RE.test(id)) return Response.json({ ok: false, error: 'not-found' }, { status: 404 });
  const order = await getOrder(id).catch(() => null);
  if (!order?.paymentDetails) return Response.json({ ok: false, error: 'not-found' }, { status: 404 });
  return Response.json(
    {
      ok: true,
      orderNumber: order.orderNumber,
      amountDue: order.amountDue,
      status: order.status,
      opening: order.paymentDetails.opening,
      closing: order.paymentDetails.closing,
      fields: order.paymentDetails.fields,
      terms: paymentTermsLines(order.orderNumber, order.locale),
    },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
