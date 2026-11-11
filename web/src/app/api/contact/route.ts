// ONE handler for orders and contact enquiries (by formName). Both channels save to the dashboard best-effort and email the shop;
// an order also always emails the customer a confirmation (no payment details, those come from the dashboard later).
import { PRODUCTS } from '@/data/catalog';
import { ORDER_REF_RE } from '@/lib/reply/order';
import { REPLY } from '@/config/reply';
import { getOrder, saveOrder } from '@/lib/reply/orderStore';
import { generateEnquiryId, saveEnquiry } from '@/lib/reply/enquiryStore';
import { contactInbox, orderInbox, sendMailBatch } from '@/lib/reply/mailer';
import { enquiryNotificationEmail, orderConfirmationEmail, orderNotificationEmail } from '@/lib/reply/emailTemplates';
import type { OrderItem, StoredEnquiry, StoredOrder } from '@/lib/reply/types';
import type { Locale } from '@/i18n/config';

const byId = new Map(PRODUCTS.map((p) => [p.id, p]));
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const bad = (error: string) => Response.json({ ok: false, error }, { status: 400 });

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return bad('invalid-json');
  }
  if (body.botcheck) return Response.json({ ok: true }); // honeypot: pretend success
  const locale: Locale = body.locale === 'en' ? 'en' : 'nl';

  if (body.formName === 'contact') return handleContact(body, locale);
  if (body.formName === 'order') return handleOrder(body, locale);
  return bad('unknown-form');
}

async function handleContact(body: Record<string, unknown>, locale: Locale) {
  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const message = clean(body.message, 4000);
  if (!name || !EMAIL_RE.test(email) || message.length < 5) return bad('invalid-fields');

  const enquiry: StoredEnquiry = {
    id: generateEnquiryId(),
    locale,
    name,
    email,
    phone: clean(body.phone, 40) || undefined,
    message,
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  let saved = false;
  try {
    saved = await saveEnquiry(enquiry);
  } catch (err) {
    console.error('enquiry save failed:', err instanceof Error ? err.message : 'unknown');
  }
  const mail = enquiryNotificationEmail(enquiry);
  const [shop] = await sendMailBatch([{ ...mail, to: contactInbox() }]);

  if (!saved && !shop.sent) return Response.json({ ok: false, error: 'unavailable' }, { status: 503 });
  return Response.json({ ok: true });
}

async function handleOrder(body: Record<string, unknown>, locale: Locale) {
  const orderNumber = clean(body.orderNumber, 20);
  if (!ORDER_REF_RE.test(orderNumber)) return bad('invalid-order-number');

  const customer = (body.customer ?? {}) as Record<string, unknown>;
  const name = `${clean(customer.firstName, 60)} ${clean(customer.lastName, 80)}`.trim();
  const email = clean(customer.email, 200);
  const phone = clean(customer.phone, 40);
  const street = clean(customer.street, 120);
  const postalCode = clean(customer.postalCode, 20);
  const city = clean(customer.city, 80);
  if (!name || !EMAIL_RE.test(email) || !phone || !street || !postalCode || !city) return bad('invalid-fields');

  const methodId = clean(body.paymentMethod, 20);
  if (!REPLY.paymentMethods.some((m) => m.id === methodId)) return bad('invalid-payment-method');

  // Prices come from the server catalogue, never from the browser.
  const rawItems = Array.isArray(body.items) ? body.items.slice(0, 20) : [];
  const items: OrderItem[] = [];
  for (const raw of rawItems as Record<string, unknown>[]) {
    const product = byId.get(clean(raw.id, 120));
    const quantity = Math.floor(Number(raw.quantity));
    if (!product || !(quantity >= 1 && quantity <= 5)) return bad('invalid-items');
    items.push({
      id: product.id,
      name: `${product.brand} ${product.model}`,
      size: clean(raw.size, 30) || '-',
      color: clean(raw.color, 60) || '-',
      quantity,
      unitPrice: product.price,
      lineTotal: product.price * quantity,
      indicative: Boolean(product.priceInfo?.originalCurrency) && product.priceInfo?.originalCurrency !== 'EUR',
    });
  }
  if (!items.length) return bad('invalid-items');

  // A double submit with the same number is a no-op rather than a second order and second emails.
  try {
    if (await getOrder(orderNumber)) return Response.json({ ok: true, orderNumber });
  } catch {
    /* store unavailable: carry on, the email path still works */
  }

  const order: StoredOrder = {
    orderNumber,
    locale,
    customerName: name,
    customerEmail: email,
    customerPhone: phone,
    address: { street, postalCode, city },
    company: body.isFietsplan ? clean(body.companyName, 120) || undefined : undefined,
    items,
    amountDue: items.reduce((s, i) => s + i.lineTotal, 0),
    paymentMethod: methodId,
    notes: clean(body.notes, 1000) || undefined,
    status: 'pending',
    channel: 'email',
    createdAt: new Date().toISOString(),
  };

  let saved = false;
  try {
    saved = await saveOrder(order);
  } catch (err) {
    console.error('order save failed:', err instanceof Error ? err.message : 'unknown');
  }

  // Shop notification and customer confirmation go out unconditionally, in one batch.
  const notification = orderNotificationEmail(order);
  const [shop, customerMail] = await sendMailBatch([
    { ...notification, to: orderInbox() },
    orderConfirmationEmail(order),
  ]);

  if (!saved && !shop.sent) return Response.json({ ok: false, error: 'unavailable' }, { status: 503 });
  return Response.json({ ok: true, orderNumber, confirmationEmailed: customerMail.sent });
}
