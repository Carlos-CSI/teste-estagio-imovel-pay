import { useState, useRef, useEffect, useMemo } from 'react';
import type { Charge } from '../../types';
import { formatCurrency, formatDate, formatChargeStatus, getStatusBadgeClass } from '../../utils/formatters';

interface ChargesListProps {
  charges: Charge[];
  loading?: boolean;
  onPaymentClick?: (charge: Charge) => void;
}

export default function ChargesList({ 
  charges, 
  loading = false,
  onPaymentClick,
}: ChargesListProps) {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [orderBy, setOrderBy] = useState<'dueDate' | 'amount' | 'status'>('dueDate');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSort = (column: 'dueDate' | 'amount') => {
    if (orderBy === column) {
      // Toggle order direction
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new column and default to ascending
      setOrderBy(column);
      setOrder('asc');
    }
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setShowStatusDropdown(false);
  };

  // Filter and sort charges locally
  const filteredAndSortedCharges = useMemo(() => {
    // First, filter by status
    let result = statusFilter 
      ? charges.filter(charge => charge.status === statusFilter)
      : [...charges];

    // Then, sort
    result.sort((a, b) => {
      let compareValue = 0;
      
      if (orderBy === 'amount') {
        compareValue = Number(a.amount) - Number(b.amount);
      } else if (orderBy === 'dueDate') {
        compareValue = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (orderBy === 'status') {
        compareValue = a.status.localeCompare(b.status);
      }

      return order === 'asc' ? compareValue : -compareValue;
    });

    return result;
  }, [charges, statusFilter, orderBy, order]);

  const renderSortIcon = (column: 'dueDate' | 'amount') => {
    if (orderBy !== column) {
      return <span className="ml-1 text-gray-400">⇅</span>;
    }
    return (
      <span className="ml-1 text-blue-600">
        {order === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

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
            <th 
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
              onClick={() => handleSort('amount')}
            >
              <div className="flex items-center">
                Valor
                {renderSortIcon('amount')}
              </div>
            </th>
            <th 
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
              onClick={() => handleSort('dueDate')}
            >
              <div className="flex items-center">
                Vencimento
                {renderSortIcon('dueDate')}
              </div>
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="relative" ref={dropdownRef}>
                <div 
                  className="flex items-center cursor-pointer hover:bg-gray-100 px-2 py-1 -mx-2 -my-1 rounded"
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                >
                  Status
                  <span className="ml-1 text-gray-400">▼</span>
                  {statusFilter && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {formatChargeStatus(statusFilter)}
                    </span>
                  )}
                </div>
                
                {showStatusDropdown && (
                  <div className="absolute z-[60] mt-2 left-0 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5" style={{ top: '100%' }}>
                    <div className="py-1">
                      <button
                        onClick={() => handleStatusFilter('')}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${statusFilter === '' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                      >
                        Todos
                      </button>
                      <button
                        onClick={() => handleStatusFilter('PENDENTE')}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${statusFilter === 'PENDENTE' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                      >
                        Pendente
                      </button>
                      <button
                        onClick={() => handleStatusFilter('PAGO')}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${statusFilter === 'PAGO' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                      >
                        Pago
                      </button>
                      <button
                        onClick={() => handleStatusFilter('VENCIDO')}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${statusFilter === 'VENCIDO' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                      >
                        Vencido
                      </button>
                      <button
                        onClick={() => handleStatusFilter('CANCELADO')}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${statusFilter === 'CANCELADO' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                      >
                        Cancelado
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </th>
            {onPaymentClick && (
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            )}
          </tr>
        </thead>
        {filteredAndSortedCharges.length !== 0 ? <tbody className="bg-white divide-y divide-gray-200">
          {filteredAndSortedCharges.map((charge) => (
            <tr key={charge.id} className="hover:bg-gray-50">
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
                      className={`inline-flex items-center px-3 py-1.5 border rounded transition border-green-300 text-green-700 bg-green-50 hover:bg-green-100`}
                    >
                      Pagar
                    </button>
                  ) : null}
                </td>
              )}
            </tr>
          ))}
        </tbody> : null} 
      </table>
      {filteredAndSortedCharges.length === 0 ? <div className="text-center py-8 text-gray-500 text-sm">
      Nenhuma cobrança encontrada
      </div> : null}
    </div>
  );
}
