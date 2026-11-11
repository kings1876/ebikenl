import { checkAdminPasscode } from '@/lib/reply/adminAuth';
import { findMethod, paymentMethodParts, parsePaymentDetail, ORDER_REF_RE } from '@/lib/reply/order';
import { getOrder, markOrderSent } from '@/lib/reply/orderStore';
import { sendMail } from '@/lib/reply/mailer';
import { paymentDetailsEmail } from '@/lib/reply/emailTemplates';

export async function POST(request: Request) {
  const denied = checkAdminPasscode(request);
  if (denied) return denied;

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const orderNumber = String(body.orderNumber ?? '');
  const methodId = String(body.methodId ?? '');
  const detail = String(body.detail ?? '');
  if (!ORDER_REF_RE.test(orderNumber) || !findMethod(methodId)) return Response.json({ ok: false, error: 'invalid' }, { status: 400 });

  const fields = parsePaymentDetail(detail);
  if (!fields.length) return Response.json({ ok: false, error: 'empty-details' }, { status: 400 });

  const order = await getOrder(orderNumber);
  if (!order) return Response.json({ ok: false, error: 'not-found' }, { status: 404 });

  const parts = paymentMethodParts(methodId, order.amountDue, order.orderNumber, order.locale);
  const mail = paymentDetailsEmail({ order, opening: parts.opening, closing: parts.closing, fields });
  const result = await sendMail(mail);
  // Not marked as sent unless the email really went out, so the dashboard never claims something that did not happen.
  if (!result.sent) return Response.json({ ok: false, error: 'mail-not-configured-or-failed' }, { status: 503 });

  await markOrderSent(orderNumber, { methodId, fields, opening: parts.opening, closing: parts.closing, sentAt: new Date().toISOString() });
  return Response.json({ ok: true });
}
