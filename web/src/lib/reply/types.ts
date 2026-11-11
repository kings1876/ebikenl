import type { Locale } from '@/i18n/config';

export interface PaymentField {
  label: string;
  value: string;
}

export interface StoredPaymentDetails {
  methodId: string;
  fields: PaymentField[];
  opening: string;
  closing: string;
  sentAt: string;
}

export interface OrderItem {
  id: string;
  name: string;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  /** True when the catalogue price is an indicative conversion (not a manufacturer EUR price). */
  indicative: boolean;
}

export type OrderStatus = 'pending' | 'payment-sent' | 'payment-confirmed';

export interface StoredOrder {
  orderNumber: string;
  locale: Locale;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: { street: string; postalCode: string; city: string };
  company?: string;
  items: OrderItem[];
  amountDue: number;
  paymentMethod: string;
  notes?: string;
  status: OrderStatus;
  channel: 'email' | 'whatsapp';
  createdAt: string;
  paymentDetails?: StoredPaymentDetails;
  paymentConfirmedAt?: string;
  paymentNote?: string;
}

export interface StoredEnquiry {
  id: string;
  locale: Locale;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'new' | 'replied';
  createdAt: string;
  repliedAt?: string;
}
