import { useState, useEffect } from 'react';
import type { Customer } from '../../types';
import { formatCPF } from '../../utils/validators';
import { customersApi } from '../../api/customers';
import { useApp } from '../../contexts/AppContext';

interface CustomerEditModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => Promise<void>;
}

export default function CustomerEditModal({
  customer,
  isOpen,
  onClose,
  onSave,
}: CustomerEditModalProps) {
  const { addToast } = useApp();
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (customer) {
      setName(customer.name);
      setError(null);
    }
  }, [customer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;

    if (!name.trim()) {
      setError('Nome é obrigatório');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await customersApi.update(customer.id, { name });
      addToast('success', 'Cliente atualizado com sucesso!');
      await onSave();
      onClose();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao atualizar cliente';
      setError(errorMessage);
      addToast('error', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !customer) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="edit-customer-title">
      <article className="bg-white rounded-lg max-w-md w-full">
        <header className="sticky top-0 bg-white z-10 p-6 border-b border-gray-200 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 id="edit-customer-title" className="text-xl font-bold text-gray-900">Editar Cliente</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {error && (
              <aside role="alert" aria-live="assertive" className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                {error}
              </aside>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CPF
              </label>
              <input
                type="text"
                value={formatCPF(customer.cpf)}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">CPF não pode ser alterado</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nome do cliente"
                required
              />
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </article>
    </div>
  );
}
