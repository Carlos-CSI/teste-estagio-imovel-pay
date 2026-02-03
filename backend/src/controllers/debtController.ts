import type { Request, Response, NextFunction } from "express";
import { IDebtCreate, type DebtStatus } from "@/types";
import debtService from "@/services/debtService";
import {
  formatErrorResponse,
  formatSuccessResponse,
} from "@/utils/responseFormatter";

interface DebtParams {
  id: string;
}

// Recebe requisições HTTP e envia respostas
class DebtController {
  // Cria uma nova cobrança
  async toCreate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data: IDebtCreate = req.body;
      const result = await debtService.toCreateDebt(data);

      if (!result.success) {
        res
          .status(400)
          .json(formatErrorResponse(result.errors || ["Erro desconhecido"]));
        return;
      }

      res.status(201).json(
        formatSuccessResponse(result.data, {
          message: result.message,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Lista todas as cobranças com filtros opcionais
  async toList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = req.query;

      const filters: any = {};
      if (
        status &&
        ["PENDENTE", "PAGO"].includes((status as string).toUpperCase())
      ) {
        filters.status = (status as string).toUpperCase() as DebtStatus;
      }

      const result = await debtService.toListDebts(filters);

      res.status(200).json(
        formatSuccessResponse(result.data, {
          total: result.total,
          filter: filters.status || "TODOS",
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Busca uma cobrança específica por ID
  async toFindById(
    req: Request<DebtParams>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      const result = await debtService.toFindDebtById(parseInt(id));

      if (!result.success) {
        res
          .status(404)
          .json(formatErrorResponse(result.errors || ["Erro 404"]));
        return;
      }

      res.status(200).json(formatSuccessResponse(result.data));
    } catch (error) {
      next(error);
    }
  }

  // Retorna estatísitcas das cobranças
  async toGetStatistics(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await debtService.toCalculateStatistics();
      res.status(200).json(formatSuccessResponse(result.data));
    } catch (error) {
      next(error);
    }
  }

  // Atualiza o status de uma cobrança
  async toUpdateStatus(
    req: Request<DebtParams>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const result = await debtService.toUpdateDebtStatus(parseInt(id), status);

      if (!result.success) {
        const statusCode = result.errors?.includes("Cobrança não encontrada")
          ? 404
          : 400;
        res
          .status(statusCode)
          .json(formatErrorResponse(result.errors || ["Erro desconhecido"]));
        return;
      }

      res
        .status(200)
        .json(formatSuccessResponse(result.data, { message: result.message }));
    } catch (error) {
      next(error);
    }
  }
}

export default new DebtController();
