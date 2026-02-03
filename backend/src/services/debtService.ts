import {
  DebtStatus,
  IDebt,
  IDebtCreate,
  IServiceResponse,
  IDebtFilters,
  DebtId,
} from "@/types";
import debtRepository from "@/repositories/debtRepository";

// Logica de negócio
class DebtService {
  // Cria um nova dívida
  async toCreateDebt(data: IDebtCreate): Promise<IServiceResponse<IDebt>> {
    try {
      // Prepara dados
      const debtData: IDebtCreate = {
        client_name: data.client_name.trim(),
        amount: parseFloat(data.amount.toString()),
        expire_date: data.expire_date,
        status: data.status || DebtStatus.PENDENTE,
      };

      // Cria um nova dívida no repositório
      const newDebt = await debtRepository.create(debtData);

      return {
        success: true,
        data: newDebt.toJSON(),
        message: "Dívida criada com sucesso!",
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro 404";
      console.error("Erro ao criar nova dívida:", errorMessage);
      throw new Error("Erro ao criar nova dívida");
    }
  }

  // Lista todas as dívidas com filtros opcionais
  async toListDebts(
    filters: IDebtFilters = {}
  ): Promise<IServiceResponse<IDebt[]>> {
    try {
      const debts = await debtRepository.findAll(filters);

      return {
        success: true,
        data: debts.map((c) => c.toJSON()),
        total: debts.length,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro 404";
      console.error("Erro ao listar dívidas:", errorMessage);
      throw new Error("Erro ao buscar dívidas");
    }
  }

  // Busca dívida por ID
  async toFindDebtById(id: DebtId): Promise<IServiceResponse<IDebt>> {
    try {
      const debt = await debtRepository.findById(id);

      if (!debt) {
        return {
          success: false,
          errors: ["Dívida não encontrada"],
        };
      }

      return {
        success: true,
        data: debt.toJSON(),
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro 404";
      console.error("Erro ao buscar dívida:", errorMessage);
      throw new Error("Erro ao buscar dívida");
    }
  }
}

export default new DebtService();
