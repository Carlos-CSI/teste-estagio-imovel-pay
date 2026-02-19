import api from './index';
import type { 
  PaymentWithCharge, 
  PaymentWithChargeAndCustomer,
  PaymentMethod 
} from '../types';

export interface CreatePaymentData {
  chargeId: number;
  amount: number;
  method?: PaymentMethod;
}

export const paymentsApi = {
  // List all payments
  getAll: async (): Promise<PaymentWithChargeAndCustomer[]> => {
    const response = await api.get<PaymentWithChargeAndCustomer[]>('/payments');
    return response.data;
  },

  // Get payment by ID
  getById: async (id: number): Promise<PaymentWithChargeAndCustomer> => {
    const response = await api.get<PaymentWithChargeAndCustomer>(`/payments/${id}`);
    return response.data;
  },

  // Create new payment
  create: async (data: CreatePaymentData): Promise<PaymentWithCharge> => {
    const response = await api.post<PaymentWithCharge>('/payments', data);
    return response.data;
  },

  // Delete payment
  delete: async (id: number): Promise<void> => {
    await api.delete(`/payments/${id}`);
  },
};
