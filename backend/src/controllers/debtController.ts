import type { Request, Response, NextFunction } from "express";
import { IDebtCreate } from "@/types";
import debtService from "@/services/debtService";
import {
  formatErrorResponse,
  formatSuccessResponse,
} from "@/utils/responseFormatter";

// Recebe requisições HTTP e envia respostas
class DebtController {
  // Cria um novo dívida
  async toCreate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data: IDebtCreate = req.body;
      const result = await debtService.toCreateDebit(data);

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
}

export default new DebtController();
