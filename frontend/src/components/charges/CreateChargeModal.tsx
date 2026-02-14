import { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { customersApi } from '../../api/customers';
import { chargesApi } from '../../api/charges';
import type { Customer } from '../../types';
import { formatCPF } from '../../utils/validators';

interface CreateChargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateChargeModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateChargeModalProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [customerId, setCustomerId] = useState<number | ''>('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [search, setSearch] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Load customers when modal opens
  useEffect(() => {
    if (isOpen) {
      loadCustomers();
      // Reset form
      setCustomerId('');
      setAmount('');
      setDueDate('');
      setSearch('');
      setError(null);
    }
  }, [isOpen]);

  // Close customer dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCustomerDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadCustomers = async () => {
    try {
      setLoadingCustomers(true);
      const customers = await customersApi.getAll();
      setCustomers(customers);
    } catch (err: any) {
      setError('Erro ao carregar clientes');
    } finally {
      setLoadingCustomers(false);
    }
  };

  const filteredCustomers = useMemo(() => {
    if (!search) return customers;
    const s = search.trim().toLowerCase();
    const digits = s.replace(/\D/g, '');
    return customers.filter((c) => {
      const nameMatch = c.name.toLowerCase().includes(s);
      const cpfDigits = (c.cpf || '').replace(/\D/g, '');
      const cpfMatch = digits.length > 0 ? cpfDigits.includes(digits) : false;
      return nameMatch || cpfMatch;
    });
  }, [customers, search]);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!customerId || !amount || !dueDate) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    // Validate date is today or future
    const selectedDate = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setError('A data de vencimento deve ser hoje ou uma data futura');
      return;
    }

    // Validate date is at most 1 year from creation (today)
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    maxDate.setHours(0, 0, 0, 0);
    if (selectedDate > maxDate) {
      setError('A data de vencimento não pode ser superior a 1 ano a partir de hoje');
      return;
    }

    // Validate amount is positive
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      setError('O valor deve ser maior que zero');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await chargesApi.create({
        customerId: Number(customerId),
        amount: amountValue,
        dueDate: new Date(dueDate).toISOString(),
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar cobrança');
    } finally {
      setLoading(false);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getMaxDate = () => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  if (!isOpen) return null;

  const modal = (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-charge-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 id="create-charge-title" className="text-xl font-bold text-gray-900">
            Nova Cobrança
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
            disabled={loading}
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="customer" className="block text-sm font-medium text-gray-700 mb-1">
              Cliente *
            </label>
            {loadingCustomers ? (
              <div className="text-sm text-gray-500">Carregando clientes...</div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowCustomerDropdown((s) => !s)}
                  className="w-full text-left px-3 py-2 border border-gray-300 rounded-md flex items-center justify-between"
                  aria-haspopup="listbox"
                  aria-expanded={showCustomerDropdown}
                  disabled={loading}
                >
                  <span className="truncate">
                    {customerId ? (customers.find((c) => c.id === customerId)?.name + ' - ' + customers.find((c) => c.id === customerId)?.cpf) : 'Selecione um cliente'}
                  </span>
                  <span className="ml-2 text-gray-500">▾</span>
                </button>

                {showCustomerDropdown && (
                  <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                    <div className="p-2">
                      <input
                        type="text"
                        placeholder="Buscar por nome ou CPF"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full mb-2 px-3 py-2 border border-gray-200 rounded-md text-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                      />
                      <div className="max-h-40 overflow-auto">
                        {filteredCustomers.length === 0 ? (
                          <div className="text-sm text-gray-500 p-2">Nenhum cliente encontrado</div>
                        ) : (
                          filteredCustomers.map((customer) => (
                            <button
                              key={customer.id}
                              type="button"
                              onClick={() => { setCustomerId(customer.id); setShowCustomerDropdown(false); }}
                              className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                            >
                              {customer.name} - {formatCPF(customer.cpf)}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Valor (R$) *
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
              Data de Vencimento *
            </label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={getTodayDate()}
              max={getMaxDate()}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || loadingCustomers}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Criando...' : 'Criar Cobrança'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
