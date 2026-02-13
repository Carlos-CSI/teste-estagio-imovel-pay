import { useEffect, useState } from 'react';
import { customersApi } from '../api/customers';
import type { Customer } from '../types';
import { formatCPF } from '../utils/validators';
import Spinner from '../components/common/Spinner';
import CustomerDetailsModal from '../components/customers/CustomerDetailsModal';
import CreateCustomerModal from '../components/customers/CreateCustomerModal';

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cpfFilter, setCpfFilter] = useState('');
  
  // Modal states
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await customersApi.getAll();
      setCustomers(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomerId(customer.id);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedCustomerId(null);
  };

  const handleCpfFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove all non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    // Limit to 11 digits (CPF length)
    const limitedValue = numericValue.slice(0, 11);
    // Apply CPF mask
    setCpfFilter(formatCPF(limitedValue));
  };

  const filteredCustomers = customers.filter(customer => {
    if (!cpfFilter) return true;
    const filterNumbers = cpfFilter.replace(/\D/g, '');
    const customerCpfNumbers = customer.cpf.replace(/\D/g, '');
    return customerCpfNumbers.includes(filterNumbers);
  });

  if (loading) {
    return (
      <section className="flex justify-center items-center h-64" aria-live="polite" aria-busy="true">
        <Spinner />
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600 mt-1">Gerenciamento de clientes</p>
        </div>

        {/* CPF Filter */}
        <aside className="flex-shrink-0" aria-label="Filtros">
          <label htmlFor="cpf-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Filtrar por CPF
          </label>
          <div className="flex items-center gap-3">
            <input
              id="cpf-filter"
              type="text"
              value={cpfFilter}
              onChange={handleCpfFilterChange}
              placeholder="000.000.000-00"
              className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />

            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none"
            >
              Novo Cliente
            </button>
          </div>

          {cpfFilter && (
            <button
              onClick={() => setCpfFilter('')}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800 transition block"
            >
              Limpar filtro
            </button>
          )}
        </aside>
      </header>

      {error && (
        <aside role="alert" aria-live="assertive" className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </aside>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {cpfFilter ? 'Nenhum cliente encontrado com este CPF' : 'Nenhum cliente encontrado'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <caption className="sr-only">Tabela de clientes cadastrados</caption>
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CPF
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatCPF(customer.cpf)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(customer)}
                        className="inline-flex items-center px-3 py-1.5 border border-blue-300 text-blue-700 bg-blue-50 rounded hover:bg-blue-100 transition"
                        aria-label={`Ver detalhes de ${customer.name}`}
                      >
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      <CustomerDetailsModal
        customerId={selectedCustomerId}
        isOpen={showDetailsModal}
        onClose={handleCloseDetailsModal}
        onCustomersChange={loadCustomers}
      />
      <CreateCustomerModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={async () => {
          await loadCustomers();
        }}
      />
    </div>
  );
}
