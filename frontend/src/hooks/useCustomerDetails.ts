import { useState, useEffect } from 'react';
import { customersApi } from '../api/customers';
import type { CustomerWithCharges } from '../types';

interface UseCustomerDetailsProps {
  customerId: number | null;
  isOpen: boolean;
}

export function useCustomerDetails({ customerId, isOpen }: UseCustomerDetailsProps) {
  const [customer, setCustomer] = useState<CustomerWithCharges | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && customerId) {
      loadCustomerDetails();
    }
  }, [isOpen, customerId]);

  const loadCustomerDetails = async () => {
    if (!customerId) return;

    try {
      setLoading(true);
      const data = await customersApi.getById(customerId);
      setCustomer(data);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao carregar detalhes do cliente');
    } finally {
      setLoading(false);
    }
  };

  const reloadCustomerData = async () => {
    if (!customerId) return;

    try {
      const data = await customersApi.getById(customerId);
      setCustomer(data);
    } catch (err: any) {
      console.error('Erro ao recarregar dados do cliente:', err);
    }
  };

  const resetState = () => {
    setCustomer(null);
  };

  return {
    customer,
    loading,
    reloadCustomerData,
    resetState,
  };
}
