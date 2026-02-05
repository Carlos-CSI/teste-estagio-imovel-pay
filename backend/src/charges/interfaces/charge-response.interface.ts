import { Charge, Customer, Payment } from '@prisma/client';

export interface ChargeWithCustomer extends Charge {
  customer: Customer;
}

export interface ChargeWithRelations extends Charge {
  customer: Customer;
  payment: Payment | null;
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
