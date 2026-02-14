import { ChargeStatus, PaymentMethod } from '../types';

export const CHARGE_STATUS_OPTIONS = [
  { value: ChargeStatus.PENDENTE, label: 'Pendente' },
  { value: ChargeStatus.PAGO, label: 'Pago' },
  { value: ChargeStatus.VENCIDO, label: 'Vencido' },
  { value: ChargeStatus.CANCELADO, label: 'Cancelado' },
];

export const PAYMENT_METHOD_OPTIONS = [
  { value: PaymentMethod.PIX, label: 'PIX' },
  { value: PaymentMethod.CREDIT_CARD, label: 'Cartão de Crédito' },
  { value: PaymentMethod.DEBIT_CARD, label: 'Cartão de Débito' },
  { value: PaymentMethod.BOLETO, label: 'Boleto' },
  { value: PaymentMethod.BANK_TRANSFER, label: 'Transferência Bancária' },
];

export const PAGINATION_LIMITS = [10, 25, 50, 100];

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
};

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  CUSTOMERS: '/customers',
  CUSTOMER_DETAILS: '/customers/:id',
  CHARGES: '/charges',
  CHARGE_DETAILS: '/charges/:id',
} as const;
