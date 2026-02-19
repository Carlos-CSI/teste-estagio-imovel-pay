import { Payment, Charge, Customer } from '@prisma/client';

export type PaymentWithCharge = Payment & { charge: Charge };

export type PaymentWithChargeAndCustomer = Payment & {
  charge: Charge & { customer: Customer };
};
