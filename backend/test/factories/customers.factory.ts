import { Customer, Charge } from '@prisma/client';
import { CreateCustomerDto } from '../../src/customers/dto/create-customer.dto';
import { UpdateCustomerDto } from '../../src/customers/dto/update-customer.dto';

let idCounter = 1;

export function resetCustomerIdCounter() {
  idCounter = 1;
}

export function makeCustomer(overrides: Partial<Customer> = {}): Customer {
  const customer: Customer = {
    id: overrides.id ?? idCounter++,
    name: overrides.name ?? 'christian volz',
    cpf: overrides.cpf ?? '12345678900',
  } as Customer;

  return { ...customer, ...overrides } as Customer;
}

export function makeCustomerWithCharges(overrides: Partial<Customer> = {}, charges: Charge[] = []) {
  const customer = makeCustomer(overrides);
  return { ...customer, charges } as Customer & { charges: Charge[] };
}

export function makeCreateCustomerDto(
  overrides: Partial<CreateCustomerDto> = {},
): CreateCustomerDto {
  return {
    name: overrides.name ?? 'christian volz',
    cpf: overrides.cpf ?? '12345678900',
    ...overrides,
  } as CreateCustomerDto;
}

export function makeUpdateCustomerDto(
  overrides: Partial<UpdateCustomerDto> = {},
): UpdateCustomerDto {
  return {
    name: overrides.name ?? 'christian berny volz',
    ...overrides,
  } as UpdateCustomerDto;
}
