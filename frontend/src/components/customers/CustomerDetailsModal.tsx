import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { Charge } from '../../types';
import { formatCPF } from '../../utils/validators';
import { formatCurrency, formatDate } from '../../utils/formatters';
import ChargesList from '../charges/ChargesList';
import { useCustomerDetails } from '../../hooks/useCustomerDetails';
import CustomerEditModal from './CustomerEditModal';
import CustomerDeleteModal from './CustomerDeleteModal';
import ChargePaymentModal from '../charges/ChargePaymentModal';

interface CustomerDetailsModalProps {
  customerId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onCustomersChange?: () => Promise<void>;
}

export default function CustomerDetailsModal({
  customerId,
  isOpen,
  onClose,
  onCustomersChange,
}: CustomerDetailsModalProps) {
  const {
    customer,
    loading,
    reloadCustomerData,
  } = useCustomerDetails({ customerId, isOpen });

  // Internal modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCharge, setSelectedCharge] = useState<Charge | null>(null);

  const handleOpenEditModal = () => setShowEditModal(true);
  const handleOpenDeleteModal = () => setShowDeleteModal(true);
  const handleOpenPaymentModal = (charge: Charge) => {
    setSelectedCharge(charge);
    setShowPaymentModal(true);
  };

  const handleCloseEditModal = () => setShowEditModal(false);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedCharge(null);
  };

  const handleEditSave = async () => {
    await reloadCustomerData();
    if (onCustomersChange) await onCustomersChange();
    handleCloseEditModal();
  };

  const handleDeleteSuccess = async () => {
    if (onCustomersChange) await onCustomersChange();
    handleCloseDeleteModal();
    onClose();
  };

  const handlePaymentSuccess = async () => {
    await reloadCustomerData();
    handleClosePaymentModal();
  };

  if (!isOpen || !customer) return null;

  const modal = (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="customer-details-title"
      >
        <article className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col relative z-50">
          <div className="bg-white z-10 p-6 border-b border-gray-200 rounded-t-lg flex-shrink-0">
            <div className="flex justify-between items-center">
              <h2 id="customer-details-title" className="text-xl font-bold text-gray-900">Detalhes do Cliente</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenEditModal}
                  className="inline-flex items-center px-3 py-1.5 border border-yellow-300 text-yellow-700 bg-yellow-50 rounded hover:bg-yellow-100 transition"
                >
                  Editar
                </button>
                <button
                  onClick={handleOpenDeleteModal}
                  className="inline-flex items-center px-3 py-1.5 border border-red-300 text-red-700 bg-red-50 rounded hover:bg-red-100 transition"
                >
                  Deletar
                </button>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl ml-2">×</button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            <section aria-labelledby="info-heading">
              <h3 id="info-heading" className="font-semibold text-gray-900 mb-3">Informações</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nome</label>
                  <p className="text-gray-900">{customer.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">CPF</label>
                  <p className="text-gray-900">{formatCPF(customer.cpf)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">ID</label>
                  <p className="text-gray-900">{customer.id}</p>
                </div>
              </div>
            </section>

            <section aria-labelledby="charges-heading">
              <div className="flex items-center justify-between mb-3">
                <h3 id="charges-heading" className="font-semibold text-gray-900">Cobranças ({customer.charges?.length || 0})</h3>
              </div>

              <ChargesList charges={customer.charges || []} loading={loading} onPaymentClick={handleOpenPaymentModal} />
            </section>

            <section aria-labelledby="payments-heading">
              <h3 id="payments-heading" className="font-semibold text-gray-900 mb-3">Pagamentos</h3>
              {customer?.charges?.some(c => c.payment) ? (
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Data Pagamento</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {customer.charges
                        .filter(c => c.payment)
                        .map((charge) => (
                          <tr key={charge.payment!.id}>
                            <td className="px-4 py-2 text-sm text-gray-900">{formatCurrency(charge.payment!.amount)}</td>
                            <td className="px-4 py-2 text-sm text-gray-600">{formatDate(charge.payment!.paidAt)}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Nenhum pagamento encontrado</p>
              )}
            </section>
          </div>

          <div className="bg-white p-6 border-t border-gray-200 rounded-b-lg flex-shrink-0">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition">Fechar</button>
          </div>
        </article>
      </div>

      {/* Child modals rendered inside the portal to keep stacking correct */}
      <CustomerEditModal customer={customer} isOpen={showEditModal} onClose={handleCloseEditModal} onSave={handleEditSave} />
      <CustomerDeleteModal customer={customer} isOpen={showDeleteModal} onClose={handleCloseDeleteModal} onDelete={handleDeleteSuccess} />
      <ChargePaymentModal charge={selectedCharge} isOpen={showPaymentModal} onClose={handleClosePaymentModal} onPaymentSuccess={handlePaymentSuccess} />
    </>
  );

  return createPortal(modal, document.body);
}
