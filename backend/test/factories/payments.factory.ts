import { Payment, Charge, Customer, PaymentMethod } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { CreatePaymentDto } from '../../src/payments/dto/create-payment.dto';

let paymentIdCounter = 1;

export function resetPaymentIdCounter() {
  paymentIdCounter = 1;
}

export function makePayment(overrides?: Partial<Payment>): Payment {
  const id = paymentIdCounter++;
  return {
    id,
    chargeId: id,
    amount: new Decimal('100.00'),
    paidAt: new Date('2024-01-15T10:00:00Z'),
    method: PaymentMethod.PIX,
    ...overrides,
  };
}

export function makePaymentWithCharge(overrides?: {
  payment?: Partial<Payment>;
  charge?: Partial<Charge>;
}): Payment & { charge: Charge } {
  const payment = makePayment(overrides?.payment);
  const charge: Charge = {
    id: payment.chargeId,
    customerId: 1,
    amount: new Decimal('100.00'),
    dueDate: new Date('2024-01-10T00:00:00.000Z'),
    status: 'PAGO',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-15T00:00:00.000Z'),
    ...overrides?.charge,
  };
  return { ...payment, charge };
}

export function makePaymentWithChargeAndCustomer(overrides?: {
  payment?: Partial<Payment>;
  charge?: Partial<Charge>;
  customer?: Partial<Customer>;
}): Payment & { charge: Charge & { customer: Customer } } {
  const payment = makePayment(overrides?.payment);
  const customer: Customer = {
    id: 1,
    name: 'Rafael Rocha',
    cpf: '12345678901',
    ...overrides?.customer,
  };
  const charge: Charge & { customer: Customer } = {
    id: payment.chargeId,
    customerId: customer.id,
    amount: new Decimal('100.00'),
    dueDate: new Date('2024-01-10T00:00:00.000Z'),
    status: 'PAGO',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-15T00:00:00.000Z'),
    customer,
    ...overrides?.charge,
  };
  return { ...payment, charge };
}

export function makeCreatePaymentDto(overrides?: Partial<CreatePaymentDto>): CreatePaymentDto {
  return {
    chargeId: 1,
    amount: 100.0,
    method: PaymentMethod.PIX,
    ...overrides,
  };
}
