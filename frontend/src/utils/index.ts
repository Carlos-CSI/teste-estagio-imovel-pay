import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { DebtStatus } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formata valor monetário para BRL
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
};

// Formata data para padrão brasileiro
export const formatDate = (date: string): string => {
  if (!date) return "";

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return "";

  return parsedDate.toLocaleDateString("pt-BR");
};

// Converte data do formato brasileiro (dd/mm/yyyy) para ISO
export const dateForISO = (date: string): string => {
  if (!date) return "";

  const [day, month, year] = date.split("/");
  if (!day || !month || !year) return "";

  const isoDate = new Date(Number(year), Number(month) - 1, Number(day));
  if (isNaN(isoDate.getTime())) return "";

  return isoDate.toISOString();
};

// Verifica se a cobrança está vencida
export const isExpired = (expireDate: string, status: DebtStatus): boolean => {
  if (status === DebtStatus.PAGO) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiration = new Date(expireDate);
  expiration.setHours(0, 0, 0, 0);

  return expiration < today;
};
