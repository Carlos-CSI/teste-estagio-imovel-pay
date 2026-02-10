import { format, parseISO, isBefore, isValid, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Format a numeric value to Brazilian currency (R$)
 */
/**
 * Format a numeric value to Brazilian currency (R$)
 * Accepts numbers or strings. For strings, normalize common
 * pt-BR formats like "1.234,56" -> "1234.56" before parsing.
 * Returns 'R$ 0,00' for invalid input.
 */
export const formatCurrency = (value: number | string): string => {
  let numValue: number;

  if (typeof value === 'string') {
    // remove spaces, remove thousand separators and convert comma to dot
    const normalized = value.trim().replace(/\s+/g, '').replace(/\./g, '').replace(',', '.');
    numValue = parseFloat(normalized);
  } else {
    numValue = value;
  }

  if (!Number.isFinite(numValue) || Number.isNaN(numValue)) {
    numValue = 0;
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numValue);
};

/**
 * Format an ISO date to Brazilian format (dd/MM/yyyy)
 */
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return '-';
  return format(dateObj, 'dd/MM/yyyy', { locale: ptBR });
};

/**
 * Format an ISO date to Brazilian format with time (dd/MM/yyyy HH:mm)
 */
export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return '-';
  return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: ptBR });
};

/**
 * Check if a date is overdue
 */
export const isOverdue = (dueDate: string | Date): boolean => {
  const dateObj = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
  if (!isValid(dateObj)) return false;
  return isBefore(startOfDay(dateObj), startOfDay(new Date()));
};

/**
 * Format payment method name
 */
export const formatPaymentMethod = (method?: string): string => {
  const methods: Record<string, string> = {
    PIX: 'PIX',
    CREDIT_CARD: 'Cartão de Crédito',
    DEBIT_CARD: 'Cartão de Débito',
    BOLETO: 'Boleto',
    BANK_TRANSFER: 'Transferência Bancária',
  };
  
  return method ? methods[method] || method : 'Não informado';
};

/**
 * Format charge status
 */
export const formatChargeStatus = (status: string): string => {
  const statuses: Record<string, string> = {
    PENDENTE: 'Pendente',
    PAGO: 'Pago',
    CANCELADO: 'Cancelado',
    VENCIDO: 'Vencido',
  };
  
  return statuses[status] || status;
};

/**
 * Return CSS class for status badge
 */
export const getStatusBadgeClass = (status: string): string => {
  const classes: Record<string, string> = {
    PENDENTE: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    PAGO: 'bg-green-100 text-green-800 border-green-300',
    CANCELADO: 'bg-gray-100 text-gray-800 border-gray-300',
    VENCIDO: 'bg-red-100 text-red-800 border-red-300',
  };
  
  return classes[status] || 'bg-gray-100 text-gray-800 border-gray-300';
};
