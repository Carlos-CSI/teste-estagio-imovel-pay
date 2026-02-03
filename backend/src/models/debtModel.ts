import type { DebtStatus, IDebt } from "@/types";

// Modelo de uma Cobrança
export class Debt implements IDebt {
  id?: number;
  client_name: string;
  amount: number;
  expire_date: string;
  status: DebtStatus;
  created_at?: Date;
  updated_at?: Date;

  constructor(data: IDebt) {
    this.id = data.id;
    this.client_name = data.client_name;
    this.amount = data.amount;
    this.expire_date = data.expire_date;
    this.status = data.status;
    this.created_at = data.created_at || new Date();
    this.updated_at = data.updated_at || new Date();
  }

  // Converte para objeto (JSON)
  toJSON(): IDebt {
    return {
      id: this.id,
      client_name: this.client_name,
      amount: parseFloat(this.amount.toString()),
      expire_date: this.expire_date,
      status: this.status,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
