import api from './index';
import type { Customer, CustomerWithCharges, ChargeStatus } from '../types';

interface GetCustomerByIdParams {
  status?: ChargeStatus;
  orderBy?: 'dueDate' | 'amount' | 'status';
  order?: 'asc' | 'desc';
}

export const customersApi = {
  // List all customers
  getAll: async (): Promise<Customer[]> => {
    const response = await api.get<Customer[]>('/customers');
    return response.data;
  },

  // Get customer by ID with optional charge filters
  getById: async (id: number, params?: GetCustomerByIdParams): Promise<CustomerWithCharges> => {
    const response = await api.get<CustomerWithCharges>(`/customers/${id}`, { params });
    return response.data;
  },

  // Create new customer
  create: async (data: { name: string; cpf: string }): Promise<Customer> => {
    const response = await api.post<Customer>('/customers', data);
    return response.data;
  },

  // Update customer
  update: async (id: number, data: { name: string }): Promise<Customer> => {
    const response = await api.patch<Customer>(`/customers/${id}`, data);
    return response.data;
  },

  // Delete customer
  delete: async (id: number): Promise<void> => {
    await api.delete(`/customers/${id}`);
  },
};
