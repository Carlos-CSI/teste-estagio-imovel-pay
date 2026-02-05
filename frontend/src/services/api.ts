import type { DebtStatus, ApiResponse, Debt, DebtCreate } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Função para fazer requisições HTTP
const request = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> => {
  const url = `${API_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data: ApiResponse<T> = await response.json();

    if (!response.ok) {
      throw new Error(data.errors?.join(", ") || "Erro desconhecido");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw Error;
    }
    throw new Error("Erro desconhecido na requisição");
  }
};

// Api de cobranças
export const debtAPI = {
  // Lista todas as cobranças
  toListAll: async (
    status: DebtStatus | null = null,
  ): Promise<ApiResponse<Debt[]>> => {
    const query = status ? `?status=${status}` : "";
    return request<Debt[]>(`/api/cobrancas${query}`);
  },

  // Atualiza status da cobrança
  toUpdateStatus: async (
    id: number,
    status: DebtStatus,
  ): Promise<ApiResponse<Debt>> => {
    return request<Debt>(`/api/cobrancas/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  // Cria nova cobrança
  toCreate: async (debt: DebtCreate): Promise<ApiResponse<Debt>> => {
    return request<Debt>("/api/cobrancas", {
      method: "POST",
      body: JSON.stringify(debt),
    });
  },
};
