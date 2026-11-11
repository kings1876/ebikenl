import nodemailer from 'nodemailer';
import { REPLY } from '@/config/reply';

export interface MailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  attachments?: { filename: string; content: Buffer; contentType?: string }[];
}

export interface MailResult {
  sent: boolean;
  reason?: string;
}

export const isMailerConfigured = () => Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

/** Destination for shop notifications; each can be redirected with an env var without a redeploy. */
export const orderInbox = () => process.env.ORDER_EMAIL || REPLY.channels.email;
export const contactInbox = () => process.env.CONTACT_EMAIL || REPLY.channels.email;

function transporter() {
  const port = Number(process.env.SMTP_PORT || 465);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

/** Sends N messages over one connection. Never throws: failures come back as { sent: false }. */
export async function sendMailBatch(messages: MailMessage[]): Promise<MailResult[]> {
  if (!isMailerConfigured()) return messages.map(() => ({ sent: false, reason: 'not-configured' }));
  const from = `"${REPLY.siteName}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`;
  const tx = transporter();
  const results: MailResult[] = [];
  for (const m of messages) {
    try {
      await tx.sendMail({ from, ...m });
      results.push({ sent: true });
    } catch (err) {
      // Log the failure class only; never the credentials or the message body.
      console.error('mail send failed:', err instanceof Error ? err.message : 'unknown');
      results.push({ sent: false, reason: 'send-failed' });
    }
  }
  tx.close();
  return results;
}

export async function sendMail(message: MailMessage): Promise<MailResult> {
  const [result] = await sendMailBatch([message]);
  return result;
}
