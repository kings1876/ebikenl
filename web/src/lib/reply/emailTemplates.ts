// Branded HTML emails. Always the LIGHT shell: white card, dark brand header band, brand colour as accent only.
// Dark-bodied emails get force-inverted by Zoho/Gmail dark mode, so the body is never dark.
import { REPLY, SITE_ORIGIN } from '@/config/reply';
import type { Locale } from '@/i18n/config';
import { methodLabel, money, paymentTermsLines } from './order';
import type { PaymentField, StoredEnquiry, StoredOrder } from './types';

const INK = '#1B2320';
const SOFT = '#6A746E';
const FAINT = '#9AA39D';
const RULE = '#E2E5DF';
const PAGE = '#F2F4F0';
const ACCENT = REPLY.brand.primary;
const HEADER = REPLY.brand.headerDark;

const L = (locale: Locale, nl: string, en: string) => (locale === 'en' ? en : nl);

export const escapeHtml = (s: string) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/** Email addresses are entity-encoded so they are not sitting in plain text in markup. */
export const encEmail = (s: string) => s.replace(/@/g, '&#64;');

const label = (text: string) =>
  `<div style="font-size:10px;letter-spacing:.08em;text-transform:uppercase;font-weight:700;color:${FAINT};margin-bottom:3px">${escapeHtml(text)}</div>`;

const field = (name: string, valueHtml: string, mb = 14) =>
  `<div style="margin-bottom:${mb}px">${label(name)}<div style="font-size:14px;color:${INK};line-height:1.5">${valueHtml}</div></div>`;

const divider = `<div style="border-top:1px solid ${RULE};margin:16px 0"></div>`;

const callout = (inner: string) =>
  `<div style="background:#F5F8FF;border-left:3px solid ${ACCENT};padding:12px 16px;margin:18px 0;border-radius:4px;font-size:13px;color:${INK};line-height:1.6">${inner}</div>`;

const button = (href: string, text: string, primary = true) =>
  `<a href="${escapeHtml(href)}" style="display:inline-block;margin:4px 6px 4px 0;padding:11px 20px;border-radius:999px;font-size:13px;font-weight:700;text-decoration:none;${
    primary ? `background:${HEADER};color:#fff` : `background:#fff;color:${HEADER};border:1px solid ${HEADER}`
  }">${escapeHtml(text)} &rarr;</a>`;

function shell({ eyebrow, title, meta, body }: { eyebrow: string; title: string; meta?: string; body: string }) {
  return `<!doctype html><html><body style="margin:0;padding:0;background:${PAGE}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAGE};padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden;font-family:Arial,Helvetica,sans-serif">
<tr><td style="background:${HEADER};padding:22px 28px">
<div style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;color:#93B4F8">${escapeHtml(eyebrow)}</div>
<div style="font-size:22px;font-weight:700;color:#fff;margin-top:4px">${escapeHtml(title)}</div>
${meta ? `<div style="font-size:12px;color:#94A3B8;margin-top:4px">${escapeHtml(meta)}</div>` : ''}
</td></tr>
<tr><td style="height:3px;background:${ACCENT};font-size:0;line-height:0">&nbsp;</td></tr>
<tr><td style="padding:26px 28px">${body}</td></tr>
<tr><td style="background:#FAFBF9;padding:14px 28px;border-top:1px solid ${RULE};font-size:11px;color:${FAINT}">${escapeHtml(REPLY.siteName)} &middot; ${escapeHtml(REPLY.domain)}</td></tr>
</table></td></tr></table></body></html>`;
}

const itemsTable = (order: StoredOrder, locale: Locale, showFlags: boolean) => {
  const rows = order.items
    .map(
      (i) => `<tr>
<td style="padding:8px 0;border-bottom:1px solid ${RULE};font-size:13px;color:${INK}">${escapeHtml(i.name)}<div style="font-size:11px;color:${SOFT}">${escapeHtml(i.size)} &middot; ${escapeHtml(i.color)} &middot; ${i.quantity}&times;${
        showFlags && i.indicative ? ` &middot; <span style="color:#B45309">${L(locale, 'indicatieve prijs', 'indicative price')}</span>` : ''
      }</div></td>
<td align="right" style="padding:8px 0;border-bottom:1px solid ${RULE};font-size:13px;color:${INK};white-space:nowrap">${money(i.lineTotal, locale)}</td></tr>`,
    )
    .join('');
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}<tr><td style="padding:10px 0;font-size:14px;font-weight:700;color:${INK}">${L(locale, 'Totaal incl. btw', 'Total incl. VAT')}</td><td align="right" style="padding:10px 0;font-size:16px;font-weight:700;color:${ACCENT}">${money(order.amountDue, locale)}</td></tr></table>`;
};

const addressLine = (o: StoredOrder) => `${o.address.street}, ${o.address.postalCode} ${o.address.city}`;
const adminUrl = (path: string) => `${SITE_ORIGIN}${path}`;

/** To the shop, when a customer places an order. */
export function orderNotificationEmail(order: StoredOrder) {
  const url = adminUrl(`/admin/orders/${encodeURIComponent(order.orderNumber)}`);
  const hasIndicative = order.items.some((i) => i.indicative);
  const body = `
${field('Customer', `${escapeHtml(order.customerName)}${order.company ? ` (${escapeHtml(order.company)})` : ''}<br>${encEmail(escapeHtml(order.customerEmail))}<br>${escapeHtml(order.customerPhone)}`)}
${field('Delivery address', escapeHtml(addressLine(order)))}
${field('Preferred payment', escapeHtml(methodLabel(order.paymentMethod, 'en')))}
${order.notes ? field('Notes', escapeHtml(order.notes)) : ''}
${divider}
${itemsTable(order, 'en', true)}
${hasIndicative ? callout('One or more items carry an <strong>indicative price</strong> (converted from a Swiss list price). Check the price before sending payment details.') : ''}
<div style="margin-top:18px">${button(url, 'Reply in Dashboard')}</div>`;
  return {
    to: '',
    subject: `New order ${order.orderNumber}: ${money(order.amountDue, 'en')} (${order.customerName})`,
    text: `New order ${order.orderNumber} from ${order.customerName} (${order.customerEmail}), total ${money(order.amountDue, 'en')}.\n${order.items.map((i) => `- ${i.name} ${i.size} ${i.color} x${i.quantity}`).join('\n')}\nReply: ${url}`,
    html: shell({ eyebrow: 'New order', title: order.orderNumber, meta: new Date(order.createdAt).toLocaleString('en-GB'), body }),
  };
}

/** To the customer, immediately after ordering. Deliberately has no payment instructions. */
export function orderConfirmationEmail(order: StoredOrder) {
  const locale = order.locale;
  const body = `
<p style="margin:0 0 14px;font-size:14px;color:${INK};line-height:1.6">${L(locale, `Hallo ${escapeHtml(order.customerName)}, bedankt voor je bestelling.`, `Hello ${escapeHtml(order.customerName)}, thank you for your order.`)}</p>
${callout(
  L(
    locale,
    `Let op de volgende e-mail: daarin sturen we je de <strong>betaalgegevens</strong> voor ordernummer <strong>${escapeHtml(order.orderNumber)}</strong>. Je bestelling is pas definitief zodra de betaling is ontvangen.`,
    `Watch for our next email: it contains the <strong>payment details</strong> for order number <strong>${escapeHtml(order.orderNumber)}</strong>. Your order is only final once payment has been received.`,
  ),
)}
${field(L(locale, 'Bezorgadres', 'Delivery address'), escapeHtml(addressLine(order)))}
${field(L(locale, 'Gekozen betaalmethode', 'Chosen payment method'), escapeHtml(methodLabel(order.paymentMethod, locale)))}
${divider}
${itemsTable(order, locale, false)}
<p style="margin:18px 0 0;font-size:12px;color:${SOFT};line-height:1.6">${L(
    locale,
    `Vragen? Antwoord op deze e-mail of mail naar <a href="mailto:${encEmail(REPLY.channels.email)}" style="color:${ACCENT}">${encEmail(REPLY.channels.email)}</a>.`,
    `Questions? Reply to this email or write to <a href="mailto:${encEmail(REPLY.channels.email)}" style="color:${ACCENT}">${encEmail(REPLY.channels.email)}</a>.`,
  )}</p>`;
  return {
    to: order.customerEmail,
    replyTo: REPLY.channels.email,
    subject: L(locale, `Bestelling ${order.orderNumber} ontvangen`, `Order ${order.orderNumber} received`),
    text: L(
      locale,
      `Bedankt voor je bestelling ${order.orderNumber} (totaal ${money(order.amountDue, locale)}). Je ontvangt de betaalgegevens in een aparte e-mail. De bestelling is definitief zodra de betaling is ontvangen.`,
      `Thank you for your order ${order.orderNumber} (total ${money(order.amountDue, locale)}). You will receive the payment details in a separate email. The order is final once payment has been received.`,
    ),
    html: shell({ eyebrow: REPLY.headerTagline[locale], title: L(locale, 'Bestelling ontvangen', 'Order received'), meta: order.orderNumber, body }),
  };
}

/** To the shop, when the contact form is used. */
export function enquiryNotificationEmail(e: StoredEnquiry) {
  const url = adminUrl(`/admin/enquiries/${encodeURIComponent(e.id)}`);
  const body = `
${field('From', `${escapeHtml(e.name)}<br>${encEmail(escapeHtml(e.email))}${e.phone ? `<br>${escapeHtml(e.phone)}` : ''}`)}
${field('Message', escapeHtml(e.message).replace(/\n/g, '<br>'), 18)}
${button(url, 'Reply in Dashboard')}`;
  return {
    to: '',
    replyTo: e.email,
    subject: `New enquiry from ${e.name}`,
    text: `New enquiry from ${e.name} (${e.email}):\n\n${e.message}\n\nReply: ${url}`,
    html: shell({ eyebrow: 'New enquiry', title: e.name, meta: new Date(e.createdAt).toLocaleString('en-GB'), body }),
  };
}

export interface PaymentEmailInput {
  order: StoredOrder;
  opening: string;
  closing: string;
  fields: PaymentField[];
}

/** To the customer, sent from the dashboard: the pasted details split into one monospace row each. */
export function paymentDetailsEmail({ order, opening, closing, fields }: PaymentEmailInput) {
  const locale = order.locale;
  const detailsUrl = `${SITE_ORIGIN}${locale === 'en' ? '/en' : ''}/order/payment-details?id=${encodeURIComponent(order.orderNumber)}`;
  const confirmUrl = `${SITE_ORIGIN}${locale === 'en' ? '/en' : ''}/order/confirm-payment?id=${encodeURIComponent(order.orderNumber)}`;
  const terms = paymentTermsLines(order.orderNumber, locale);
  const rows = fields
    .map((f) => field(f.label, `<span style="font-family:Consolas,Menlo,monospace;font-size:14px;word-break:break-all">${escapeHtml(f.value)}</span>`, 10))
    .join('');
  const body = `
${field(L(locale, 'Bestelling', 'Order'), `<strong>${escapeHtml(order.orderNumber)}</strong>`, 8)}
${field(L(locale, 'Te betalen', 'Amount due'), `<span style="font-size:20px;font-weight:700;color:${ACCENT}">${money(order.amountDue, locale)}</span>`)}
${divider}
<p style="margin:0 0 14px;font-size:14px;color:${INK};line-height:1.6">${escapeHtml(opening)}</p>
${rows}
<p style="margin:14px 0;font-size:14px;color:${INK};line-height:1.6">${escapeHtml(closing)}</p>
<div style="margin:16px 0">${button(detailsUrl, L(locale, 'Bekijk en kopieer betaalgegevens', 'View & copy payment details'))}</div>
${callout(`<ul style="margin:0;padding-left:18px">${terms.map((t) => `<li>${escapeHtml(t)}</li>`).join('')}</ul>`)}
<div>${button(confirmUrl, L(locale, 'Ik heb betaald: bevestiging uploaden', "I've paid: upload confirmation"), false)}${button(`mailto:${encEmail(REPLY.channels.email)}?subject=${encodeURIComponent(order.orderNumber)}`, L(locale, 'Reageer op deze e-mail', 'Reply to us'), false)}</div>`;
  return {
    to: order.customerEmail,
    replyTo: REPLY.channels.email,
    subject: L(locale, `Betaalgegevens voor bestelling ${order.orderNumber}: ${money(order.amountDue, locale)}`, `Payment details for order ${order.orderNumber}: ${money(order.amountDue, locale)} due`),
    text: [
      `${order.orderNumber} - ${money(order.amountDue, locale)}`,
      '',
      opening,
      '',
      ...fields.map((f) => `${f.label}: ${f.value}`),
      '',
      closing,
      '',
      ...terms.map((t) => `- ${t}`),
      '',
      detailsUrl,
    ].join('\n'),
    html: shell({ eyebrow: REPLY.headerTagline[locale], title: L(locale, 'Betaalgegevens', 'Payment details'), meta: order.orderNumber, body }),
  };
}

/** To the customer, the operator's typed answer to an enquiry. */
export function enquiryReplyEmail(e: StoredEnquiry, reply: string) {
  const locale = e.locale;
  const body = `
<p style="margin:0 0 14px;font-size:14px;color:${INK};line-height:1.7">${escapeHtml(reply).replace(/\n/g, '<br>')}</p>
${divider}
${field(L(locale, 'Jouw bericht', 'Your message'), `<span style="color:${SOFT}">${escapeHtml(e.message).replace(/\n/g, '<br>')}</span>`, 0)}`;
  return {
    to: e.email,
    replyTo: REPLY.channels.email,
    subject: L(locale, 'Antwoord op je bericht', 'Reply to your message'),
    text: `${reply}\n\n---\n${e.message}`,
    html: shell({ eyebrow: REPLY.headerTagline[locale], title: L(locale, 'Antwoord op je bericht', 'Reply to your message'), body }),
  };
}

/** To the shop, when a customer uploads a payment screenshot. */
export function paymentConfirmationNotice(order: StoredOrder, note: string) {
  const url = adminUrl(`/admin/orders/${encodeURIComponent(order.orderNumber)}`);
  const body = `
${field('Order', `<strong>${escapeHtml(order.orderNumber)}</strong> &middot; ${money(order.amountDue, 'en')}`)}
${field('Customer', `${escapeHtml(order.customerName)}<br>${encEmail(escapeHtml(order.customerEmail))}`)}
${note ? field('Note', escapeHtml(note).replace(/\n/g, '<br>')) : ''}
<p style="font-size:13px;color:${SOFT}">The screenshot is attached. Check your bank before dispatching.</p>
${button(url, 'Open order')}`;
  return {
    to: '',
    replyTo: order.customerEmail,
    subject: `Payment confirmation uploaded: ${order.orderNumber}`,
    text: `Customer ${order.customerName} says they paid order ${order.orderNumber}. Screenshot attached. ${url}`,
    html: shell({ eyebrow: 'Payment confirmation', title: order.orderNumber, body }),
  };
}
