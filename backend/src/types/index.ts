// Enums
export enum DebtStatus {
  PENDENTE = "PENDENTE",
  PAGO = "PAGO",
}

// Interfaces de Configuração
export interface IDatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  waitForConnections: boolean;
  connectionLimit: number;
  queueLimit: number;
}

// Interfaces de domínio
export interface IDebt {
  id?: number;
  client_name: string;
  amount: number;
  expire_date: string;
  status: DebtStatus;
  created_at?: Date;
  updated_at?: Date;
}

export interface IDebtCreate {
  client_name: string;
  amount: number;
  expire_date: string;
  status?: DebtStatus;
}

// Interfaces de Filtro
export interface IDebtFilters {
  status?: DebtStatus;
}

// Interfaces de Resposta
export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  errors?: string[];
  message?: string;
  meta?: Record<string, any>;
}

export interface IServiceResponse<T> {
  success: boolean;
  data?: T;
  errors?: string[];
  message?: string;
  total?: number;
}

// Tipos utilitários
export type DebtId = number;
export type Status = DebtStatus.PENDENTE | DebtStatus.PAGO;
