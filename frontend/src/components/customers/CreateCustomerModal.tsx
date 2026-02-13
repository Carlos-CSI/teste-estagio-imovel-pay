import { useState, useEffect } from 'react';
import { customersApi } from '../../api/customers';
import { useApp } from '../../contexts/AppContext';
import { formatCPF, unformatCPF, validateCPF } from '../../utils/validators';

interface CreateCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: () => Promise<void>;
}

export default function CreateCustomerModal({ isOpen, onClose, onCreate }: CreateCustomerModalProps) {
  const { addToast } = useApp();
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setCpf('');
      setError(null);
      setSubmitting(false);
    }
  }, [isOpen]);

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = e.target.value.replace(/\D/g, '').slice(0, 11);
    setCpf(formatCPF(numeric));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cpfNumbers = unformatCPF(cpf);

    if (!name.trim()) {
      setError('Nome é obrigatório');
      return;
    }

    if (!validateCPF(cpfNumbers)) {
      setError('CPF inválido');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await customersApi.create({ name: name.trim(), cpf: cpfNumbers });
      addToast('success', 'Cliente criado com sucesso!');
      await onCreate();
      onClose();
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao criar cliente';
      setError(message);
      addToast('error', message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4" role="dialog" aria-modal="true" aria-labelledby="create-customer-title">
      <article className="bg-white rounded-lg max-w-md w-full">
        <header className="sticky top-0 bg-white z-10 p-6 border-b border-gray-200 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 id="create-customer-title" className="text-xl font-bold text-gray-900">Novo Cliente</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
              aria-label="Fechar modal"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">CPF *</label>
              <input
                type="text"
                value={cpf}
                onChange={handleCpfChange}
                placeholder="000.000.000-00"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome do cliente"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? 'Criando...' : 'Criar'}
            </button>
          </div>
        </form>
      </article>
    </div>
  );
}
