/**
 * Validate Brazilian CPF
 */
export const validateCPF = (cpf: string): boolean => {
  // Remove non-numeric characters
  const cleanCPF = cpf.replace(/\D/g, '');
  
  // Check if it has 11 digits
  if (cleanCPF.length !== 11) return false;
  
  // Check if all digits are the same
  if (/^(\d)\1+$/.test(cleanCPF)) return false;
  
  // Validate check digits
  let sum = 0;
  let remainder;
  
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;
  
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false;
  
  return true;
};

/**
 * Format CPF to pattern XXX.XXX.XXX-XX
 */
export const formatCPF = (cpf: string): string => {
  const cleanCPF = cpf.replace(/\D/g, '');
  
  if (cleanCPF.length <= 11) {
    return cleanCPF
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  
  return cpf;
};

/**
 * Remove CPF mask
 */
export const unformatCPF = (cpf: string): string => {
  return cpf.replace(/\D/g, '');
};

/**
 * Normalize amount string for parsing (handles common pt-BR formats).
 * Examples:
 *   "10,50"     -> "10.50"
 *   "1.234,56"  -> "1234.56"
 *   "1234.56"   -> "1234.56"
 */
const normalizeAmountString = (value: string): string => {
  let normalized = value.trim();

  // Remove all spaces
  normalized = normalized.replace(/\s+/g, '');

  const hasComma = normalized.includes(',');
  const hasDot = normalized.includes('.');

  if (hasComma) {
    // Treat comma as decimal separator; remove dots as thousands separators
    normalized = normalized.replace(/\./g, '').replace(',', '.');
  } else if (hasDot) {
    // No comma: assume dot is decimal separator and leave as-is
    // (values like "1234.56")
  }

  return normalized;
};

/**
 * Validate if value is a valid number
 */
export const validateAmount = (value: string | number): boolean => {
  const numValue =
    typeof value === 'string' ? parseFloat(normalizeAmountString(value)) : value;
  return !isNaN(numValue) && numValue > 0;
};

/**
 * Validate if date is valid and not in the past
 */
import { parseISO, isValid, startOfDay } from 'date-fns';

export const validateFutureDate = (date: string): boolean => {
  const parsed = parseISO(date);
  const dateObj = isValid(parsed) ? parsed : new Date(date);
  if (!isValid(dateObj)) return false;

  const todayStart = startOfDay(new Date());
  return startOfDay(dateObj) >= todayStart;
};
