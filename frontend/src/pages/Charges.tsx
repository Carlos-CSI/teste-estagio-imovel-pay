import { useEffect, useState } from 'react';
import { chargesApi } from '../api/charges';
import type { ChargeWithCustomer } from '../types';
import Spinner from '../components/common/Spinner';
import ChargesTable from '../components/charges/ChargesTable';
import ChargesFilters from '../components/charges/ChargesFilters';
import CreateChargeModal from '../components/charges/CreateChargeModal';
import ChargePaymentModal from '../components/charges/ChargePaymentModal';

export default function Charges() {
  const [charges, setCharges] = useState<ChargeWithCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCharge, setSelectedCharge] = useState<ChargeWithCustomer | null>(null);

  // Filters  
  const [statusFilter, setStatusFilter] = useState('');
  const [orderBy, setOrderBy] = useState<'dueDate' | 'amount' | 'status'>('dueDate');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    loadCharges();
  }, [currentPage, limit]);

  const loadCharges = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: any = {
        page: currentPage,
        limit,
      };

      // Add filters if set
      if (statusFilter) {
        params.status = statusFilter;
      }
      if (orderBy) {
        params.orderBy = orderBy;
      }
      if (order) {
        params.order = order;
      }
      
      const response = await chargesApi.getAll(params);
      setCharges(response.data);
      setTotal(response.meta.total);
      setTotalPages(response.meta.totalPages);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar cobranças');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    setCurrentPage(1); // Reset to first page when applying filters
    loadCharges();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1); // Reset to first page when changing limit
  };

  const handleCreateSuccess = () => {
    loadCharges(); // Reload charges after creating
  };

  const handleOpenPaymentModal = (charge: ChargeWithCustomer) => {
    setSelectedCharge(charge);
    setShowPaymentModal(true);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedCharge(null);
  };

  const handlePaymentSuccess = async () => {
    await loadCharges();
    handleClosePaymentModal();
  };

  if (loading && charges.length === 0) {
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
          <h1 className="text-2xl font-bold text-gray-900">Cobranças</h1>
          <p className="text-gray-600 mt-1">Gerenciamento de cobranças</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center gap-2"
        >
          <span className="text-xl leading-none">+</span>
          Nova Cobrança
        </button>
      </header>

      {error && (
        <aside role="alert" aria-live="assertive" className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </aside>
      )}

      <ChargesFilters
        statusFilter={statusFilter}
        orderBy={orderBy}
        order={order}
        loading={loading}
        onStatusChange={setStatusFilter}
        onOrderByChange={setOrderBy}
        onOrderChange={setOrder}
        onApply={handleApplyFilters}
      />

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {charges.length === 0 && !loading ? (
          <div className="p-8 text-center text-gray-500">
            Nenhuma cobrança encontrada
          </div>
        ) : (
          <>
            <ChargesTable 
              charges={charges}
              loading={loading}
              showCustomerColumn={true}
              onPaymentClick={(c) => handleOpenPaymentModal(c as ChargeWithCustomer)}
            />

            {/* Pagination */}
            {!loading && charges.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <label htmlFor="limit-select" className="text-sm text-gray-600">
                        Itens por página:
                      </label>
                      <select
                        id="limit-select"
                        value={limit}
                        onChange={(e) => handleLimitChange(Number(e.target.value))}
                        className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                    </div>
                    <div className="text-sm text-gray-600">
                      {total} cobranças
                    </div>
                  </div>
                  
                  {totalPages > 1 && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1 || loading}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Anterior
                      </button>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNumber;
                        if (totalPages <= 5) {
                          pageNumber = i + 1;
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i;
                        } else {
                          pageNumber = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            disabled={loading}
                            className={`px-3 py-1 text-sm border rounded ${
                              currentPage === pageNumber
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-gray-50'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || loading}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Próximo
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <CreateChargeModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />
      <ChargePaymentModal
        charge={selectedCharge}
        isOpen={showPaymentModal}
        onClose={handleClosePaymentModal}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
