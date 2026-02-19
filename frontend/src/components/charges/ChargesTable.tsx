import type { Charge } from '../../types';
import { formatCurrency, formatDate, formatChargeStatus, getStatusBadgeClass } from '../../utils/formatters';

interface ChargesTableProps {
  charges: Charge[];
  loading?: boolean;
  onPaymentClick?: (charge: Charge) => void;
  showCustomerColumn?: boolean;
  emptyMessage?: string;
}

export default function ChargesTable({ 
  charges, 
  loading = false,
  onPaymentClick,
  showCustomerColumn = false,
  emptyMessage = 'Nenhuma cobrança encontrada'
}: ChargesTableProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg relative">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {showCustomerColumn && (
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
            )}
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Valor
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vencimento
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            {onPaymentClick && (
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pagamento
              </th>
            )}
          </tr>
        </thead>
        {charges.length > 0 ? (
          <tbody className="bg-white divide-y divide-gray-200">
            {charges.map((charge) => (
              <tr key={charge.id} className="hover:bg-gray-50">
                {showCustomerColumn && (
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {charge.customer?.name || '-'}
                  </td>
                )}
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(charge.amount)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {formatDate(charge.dueDate)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <span 
                    className={`inline-flex px-2 py-1 text-xs font-medium border rounded ${getStatusBadgeClass(charge.status)}`}
                  >
                    {formatChargeStatus(charge.status)}
                  </span>
                </td>
                {onPaymentClick && (
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    {!(charge.status === 'PAGO' || charge.status === 'CANCELADO') ? (
                      <button
                        onClick={() => onPaymentClick(charge)}
                        className="inline-flex items-center px-3 py-1.5 border rounded transition border-green-300 text-green-700 bg-green-50 hover:bg-green-100"
                      >
                        Pagar
                      </button>
                    ) : null}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        ) : null}
      </table>
      {charges.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">
          {emptyMessage}
        </div>
      )}
    </div>
  );
}
