import { Customer, Charge } from '@prisma/client';

export type CustomerWithCharges = Customer & { charges: Charge[] };

export interface PaginatedCustomersResponse<T = CustomerWithCharges> {
  data: T[];
  meta: {
    total: number;
    limit: number;
    page: number;
    totalPages: number;
  };
}
