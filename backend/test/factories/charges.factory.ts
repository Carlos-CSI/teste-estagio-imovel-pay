import { Charge, Customer, ChargeStatus, Payment } from '@prisma/client';
import { CreateChargeDto } from '../../src/charges/dto/create-charge.dto';
import { UpdateChargeDto } from '../../src/charges/dto/update-charge.dto';
import { Decimal } from '@prisma/client/runtime/library';

let chargeIdCounter = 1;

export function resetChargeIdCounter() {
  chargeIdCounter = 1;
}

export function makeCharge(overrides: Partial<Charge> = {}): Charge {
  const charge: Charge = {
    id: overrides.id ?? chargeIdCounter++,
    customerId: overrides.customerId ?? 1,
    amount: overrides.amount ?? new Decimal(100.50),
    dueDate: overrides.dueDate ?? new Date('2026-03-01'),
    status: overrides.status ?? ChargeStatus.PENDENTE,
    createdAt: overrides.createdAt ?? new Date(),
    updatedAt: overrides.updatedAt ?? new Date(),
  } as Charge;

  return { ...charge, ...overrides } as Charge;
}

export function makeChargeWithCustomer(
  overrides: Partial<Charge> = {},
  customer?: Partial<Customer>,
) {
  const charge = makeCharge(overrides);
  const customerData: Customer = customer ? {
    id: customer.id ?? charge.customerId,
    name: customer.name ?? 'Test Customer',
    cpf: customer.cpf ?? '12345678900',
  } as Customer : {
    id: charge.customerId,
    name: 'Test Customer',
    cpf: '12345678900',
  } as Customer;
  
  return { ...charge, customer: customerData } as Charge & { customer: Customer };
}

export function makeChargeWithCustomerAndPayment(
  overrides: Partial<Charge> = {},
  customer?: Partial<Customer>,
  payment?: Partial<Payment>,
) {
  const chargeWithCustomer = makeChargeWithCustomer(overrides, customer);
  const paymentData: Payment = payment ? {
    id: payment.id ?? 1,
    chargeId: payment.chargeId ?? chargeWithCustomer.id,
    amount: payment.amount ?? chargeWithCustomer.amount,
    paidAt: payment.paidAt ?? new Date(),
    method: payment.method ?? 'PIX',
  } as Payment : null;
  
  return { ...chargeWithCustomer, payment: paymentData } as Charge & { customer: Customer; payment: Payment | null };
}

export function makeCreateChargeDto(
  overrides: Partial<CreateChargeDto> = {},
): CreateChargeDto {
  return {
    customerId: overrides.customerId ?? 1,
    amount: overrides.amount ?? 100.50,
    dueDate: overrides.dueDate ?? '2026-03-01T00:00:00.000Z',
    ...overrides,
  } as CreateChargeDto;
}

export function makeUpdateChargeDto(
  overrides: Partial<UpdateChargeDto> = {},
): UpdateChargeDto {
  return {
    amount: overrides.amount,
    dueDate: overrides.dueDate,
    status: overrides.status,
    ...overrides,
  } as UpdateChargeDto;
}
