// Public: a customer uploads a screenshot of their payment. Only works for real orders that already received payment details.
import { ORDER_REF_RE } from '@/lib/reply/order';
import { getOrder, markPaymentConfirmed } from '@/lib/reply/orderStore';
import { orderInbox, sendMail } from '@/lib/reply/mailer';
import { paymentConfirmationNotice } from '@/lib/reply/emailTemplates';

const MAX_BYTES = 4 * 1024 * 1024;
const TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/heic': 'heic',
};

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  if (!form) return Response.json({ ok: false, error: 'invalid-form' }, { status: 400 });

  const id = String(form.get('id') ?? '');
  const note = String(form.get('note') ?? '').trim().slice(0, 1000);
  const file = form.get('file');
  if (!ORDER_REF_RE.test(id)) return Response.json({ ok: false, error: 'not-found' }, { status: 404 });
  if (!(file instanceof File) || !TYPES[file.type]) return Response.json({ ok: false, error: 'invalid-file' }, { status: 400 });
  if (file.size > MAX_BYTES) return Response.json({ ok: false, error: 'file-too-large' }, { status: 413 });

  const order = await getOrder(id).catch(() => null);
  if (!order?.paymentDetails) return Response.json({ ok: false, error: 'not-found' }, { status: 404 });

  const mail = paymentConfirmationNotice(order, note);
  const result = await sendMail({
    ...mail,
    to: orderInbox(),
    attachments: [{ filename: `${order.orderNumber}.${TYPES[file.type]}`, content: Buffer.from(await file.arrayBuffer()), contentType: file.type }],
  });
  if (!result.sent) return Response.json({ ok: false, error: 'unavailable' }, { status: 503 });

  await markPaymentConfirmed(id, note || undefined);
  return Response.json({ ok: true });
}
