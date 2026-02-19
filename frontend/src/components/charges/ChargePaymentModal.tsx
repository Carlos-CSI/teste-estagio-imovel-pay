import { useState, useEffect } from 'react';
import type { Charge, InterestCalculation } from '../../types';
import { paymentsApi } from '../../api/payments';
import { chargesApi } from '../../api/charges';
import { useApp } from '../../contexts/AppContext';

interface ChargePaymentModalProps {
  charge: Charge | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => Promise<void>;
}

export default function ChargePaymentModal({
  charge,
  isOpen,
  onClose,
  onPaymentSuccess,
}: ChargePaymentModalProps) {
  const { addToast } = useApp();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('PIX');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [calculation, setCalculation] = useState<InterestCalculation | null>(null);
  const [loadingCalculation, setLoadingCalculation] = useState(false);

  useEffect(() => {
    if (charge) {
      setMethod('PIX');
      setError(null);
      setCalculation(null);
      
      // Fetch calculated amount from backend
      const fetchCalculation = async () => {
        try {
          setLoadingCalculation(true);
          const calc = await chargesApi.calculatePaymentAmount(charge.id);
          setCalculation(calc);
          setAmount(String(calc.totalAmount));
        } catch (err: any) {
          setError(err.response?.data?.message || 'Erro ao calcular valor do pagamento');
          setAmount(String(charge.amount));
        } finally {
          setLoadingCalculation(false);
        }
      };
      
      fetchCalculation();
    }
  }, [charge]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!charge) return;

    if (!amount || parseFloat(amount) <= 0) {
      setError('Valor do pagamento inválido');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await paymentsApi.create({
        chargeId: charge.id,
        amount: parseFloat(amount),
        method: method as any,
      });
      
      addToast('success', 'Pagamento registrado com sucesso!');
      await onPaymentSuccess();
      onClose();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao processar pagamento';
      setError(errorMessage);
      addToast('error', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !charge) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4" role="dialog" aria-modal="true" aria-labelledby="payment-modal-title">
      <article className="bg-white rounded-lg max-w-md w-full">
        <header className="sticky top-0 bg-white z-10 p-6 border-b border-gray-200 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 id="payment-modal-title" className="text-xl font-bold text-gray-900">Registrar Pagamento</h2>
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
                Valor da Cobrança
              </label>
              <input
                type="number"
                step="0.01"
                value={charge.amount}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>

            {loadingCalculation ? (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2 rounded text-sm">
                Calculando valor com juros...
              </div>
            ) : calculation && calculation.isOverdue && calculation.interest > 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded text-sm space-y-1">
                <p className="font-semibold text-yellow-800">Cobrança Vencida - Juros Aplicados</p>
                <div className="flex justify-between text-yellow-700">
                  <span>Valor Original:</span>
                  <span>R$ {calculation.originalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-yellow-700">
                  <span>Juros (10% ao mês - {calculation.monthsOverdue.toFixed(2)} meses):</span>
                  <span>R$ {calculation.interest.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-yellow-800 border-t border-yellow-300 pt-1">
                  <span>Total a Pagar:</span>
                  <span>R$ {calculation.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            ) : null}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor do Pagamento
              </label>
              <input
                type="number"
                step="0.01"
                value={amount}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                placeholder="0.00"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {calculation?.isOverdue 
                  ? 'Pagamento integral obrigatório - valor inclui juros de atraso (10% ao mês)'
                  : 'Pagamento integral obrigatório - sem juros'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Método de Pagamento *
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="PIX">PIX</option>
                <option value="CREDIT_CARD">Cartão de Crédito</option>
                <option value="DEBIT_CARD">Cartão de Débito</option>
                <option value="BOLETO">Boleto</option>
                <option value="BANK_TRANSFER">Transferência Bancária</option>
              </select>
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
              {submitting ? 'Processando...' : 'Confirmar Pagamento'}
            </button>
          </div>
        </form>
      </article>
    </div>
  );
}
