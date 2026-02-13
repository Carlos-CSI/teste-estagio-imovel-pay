import { useState, useEffect } from 'react';
import type { Customer } from '../../types';
import { customersApi } from '../../api/customers';
import Timer from '../common/Timer';
import { useApp } from '../../contexts/AppContext';

interface CustomerDeleteModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>;
}

export default function CustomerDeleteModal({
  customer,
  isOpen,
  onClose,
  onDelete,
}: CustomerDeleteModalProps) {
  const { addToast } = useApp();
  const [submitting, setSubmitting] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCanDelete(false);
    }
  }, [isOpen]);

  const handleConfirmDelete = async () => {
    if (!customer) return;

    try {
      setSubmitting(true);
      await customersApi.delete(customer.id);
      addToast('success', 'Cliente deletado com sucesso!');
      await onDelete();
      onClose();
    } catch (err: any) {
      addToast('error', err.response?.data?.message || 'Erro ao deletar cliente');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !customer) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="delete-customer-title">
      <article className="bg-white rounded-lg max-w-md w-full">
        <header className="sticky top-0 bg-white z-10 p-6 border-b border-gray-200 rounded-t-lg">
          <h2 id="delete-customer-title" className="text-xl font-bold text-gray-900">Confirmar Exclusão</h2>
        </header>

        <section className="p-6">
          <p className="text-gray-700">
            Tem certeza que deseja deletar o cliente <strong>{customer.name}</strong>?
          </p>
          <p className="text-sm text-red-600 mt-2">
            Esta ação não pode ser desfeita e todas as cobranças associadas serão removidas.
          </p>
        </section>

        <footer className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
            disabled={submitting}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50"
            disabled={submitting || !canDelete}
          >
            {submitting ? 'Deletando...' : 'Deletar'}{' '}
            {!submitting && <Timer seconds={10} onTimerEnd={() => setCanDelete(true)} />}
          </button>
        </footer>
      </article>
    </div>
  );
}
