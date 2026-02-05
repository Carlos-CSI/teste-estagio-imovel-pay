// Enums
export enum DebtStatus {
  PENDENTE = "PENDENTE",
  PAGO = "PAGO",
}

// Interfaces de domínio
export interface Debt {
  id: number;
  client_name: string;
  amount: number;
  expire_date: string;
  status: DebtStatus;
  created_at?: string;
  updated_at?: string;
}

// Interfaces de resposta da API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  errors?: string[];
  message?: string;
  meta?: {
    total?: number;
    filter?: string;
    message?: string;
  };
}

// Tipos utilitários
export interface StatusInfo {
  label: string;
  class: string;
  variant: "pending" | "paid";
}

export type StatusFilter = "TODOS" | DebtStatus;
