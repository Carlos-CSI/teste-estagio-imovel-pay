import api from './index';
import type { 
  PaginatedChargesResponse, 
  ChargeWithCustomer, 
  ChargeWithRelations,
  ChargeStatus,
  InterestCalculation
} from '../types';

export interface CreateChargeData {
  customerId: number;
  amount: number;
  dueDate: string;
}

export interface UpdateChargeData {
  status?: ChargeStatus;
  amount?: number;
  dueDate?: string;
}

export interface QueryChargesParams {
  page?: number;
  limit?: number;
  status?: ChargeStatus;
}

export const chargesApi = {
  // List charges with pagination and filters
  getAll: async (params?: QueryChargesParams): Promise<PaginatedChargesResponse> => {
    const response = await api.get<PaginatedChargesResponse>('/charges', { params });
    return response.data;
  },

  // Get charge by ID
  getById: async (id: number): Promise<ChargeWithRelations> => {
    const response = await api.get<ChargeWithRelations>(`/charges/${id}`);
    return response.data;
  },

  // Create new charge
  create: async (data: CreateChargeData): Promise<ChargeWithCustomer> => {
    const response = await api.post<ChargeWithCustomer>('/charges', data);
    return response.data;
  },

  // Update charge
  update: async (id: number, data: UpdateChargeData): Promise<ChargeWithCustomer> => {
    const response = await api.patch<ChargeWithCustomer>(`/charges/${id}`, data);
    return response.data;
  },

  // Delete charge
  delete: async (id: number): Promise<void> => {
    await api.delete(`/charges/${id}`);
  },

  // Calculate payment amount with interest
  calculatePaymentAmount: async (id: number): Promise<InterestCalculation> => {
    const response = await api.get<InterestCalculation>(`/charges/${id}/calculate-payment`);
    return response.data;
  },
};
