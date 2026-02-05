import type { IApiResponse } from "@/types";

// Formata resposta HTTP: sucesso
export const formatSuccessResponse = <T>(
  data: T,
  meta: Record<string, any> = {}
): IApiResponse<T> => {
  const response: IApiResponse<T> = {
    success: true,
    data,
  };

  // Adiciona metadados se houver
  if (Object.keys(meta).length > 0) {
    response.meta = meta;
  }

  return response;
};

// Formata resposta HTTP: erro
export const formatErrorResponse = (
  errors: string[] | string,
  message?: string
): IApiResponse<null> => {
  // Garante que errors seja sempre um array
  const errorArray = Array.isArray(errors) ? errors : [errors];

  const response: IApiResponse<null> = {
    success: false,
    errors: errorArray,
  };

  if (message) {
    response.message = message;
  }

  return response;
};
