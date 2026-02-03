import { Request, Response, NextFunction } from "express";
import { formatErrorResponse } from "@/utils/responseFormatter";

// Middleware para tratar erros
// Captura todos os erros não tratados e retorna uma resposta padronizada
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log do erro
  console.error("Erro capturado:", {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    url: req.url,
    method: req.method,
  });

  const statusCode = (err as any).statusCode || 500;

  let errorMessage = err.message || "Erro interno do servidor";
  if (process.env.NODE_ENV === "production" && statusCode === 500) {
    errorMessage = "Erro interno do servidor";
  }

  // Envia resposta de erro formatada
  res
    .status(statusCode)
    .json(
      formatErrorResponse(
        [errorMessage],
        statusCode === 500 ? "Ocorreu um erro inesperado" : undefined
      )
    );
};

// Middleware para tratar rotas não encontradas (404)
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res
    .status(404)
    .json(
      formatErrorResponse(
        [`Rota ${req.method} ${req.url} não encontrada`],
        "Endpoint não existe"
      )
    );
};
