/**
 * Utility helpers for parsing currency/number values coming from API or user input.
 */
export const parseCurrencyToNumber = (v: string | number | null | undefined): number => {
  if (v == null) return 0;
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0;

  const normalized = String(v).trim().replace(/\s+/g, '').replace(/\./g, '').replace(',', '.');
  const n = parseFloat(normalized);
  return Number.isFinite(n) ? n : 0;
};

export default parseCurrencyToNumber;
