export interface Customer {
  id: number;
  name: string;
  cpf: string;
}

export interface CustomerWithCharges extends Customer {
  charges: Charge[];
}

export const ChargeStatus = {
  PENDENTE: 'PENDENTE' as const,
  PAGO: 'PAGO' as const,
  CANCELADO: 'CANCELADO' as const,
  VENCIDO: 'VENCIDO' as const,
} as const;

export type ChargeStatus = typeof ChargeStatus[keyof typeof ChargeStatus];

export interface Charge {
  id: number;
  customerId: number;
  customer?: Customer;
  amount: number | string;
  dueDate: string;
  status: ChargeStatus;
  createdAt: string;
  updatedAt: string;
  payment?: Payment;
}

export interface ChargeWithCustomer extends Charge {
  customer: Customer;
}

export interface PaginatedChargesResponse {
  data: ChargeWithCustomer[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const PaymentMethod = {
  PIX: 'PIX' as const,
  CREDIT_CARD: 'CREDIT_CARD' as const,
  DEBIT_CARD: 'DEBIT_CARD' as const,
  BOLETO: 'BOLETO' as const,
  BANK_TRANSFER: 'BANK_TRANSFER' as const,
} as const;

export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];

export interface Payment {
  id: number;
  chargeId: number;
  charge?: Charge;
  amount: number | string;
  paidAt: string;
  method?: PaymentMethod;
}

export interface PaymentWithCharge extends Payment {
  charge: Charge;
}

export interface PaymentWithChargeAndCustomer extends Payment {
  charge: ChargeWithCustomer;
}

export interface ChargeWithRelations extends ChargeWithCustomer {
  payment?: Payment;
}

export interface InterestCalculation {
  originalAmount: number;
  interest: number;
  totalAmount: number;
  isOverdue: boolean;
  monthsOverdue: number;
}
