import {
  DebtStatus,
  IDebt,
  IDebtCreate,
  IServiceResponse,
  IDebtFilters,
  DebtId,
  type IEstatisticas,
} from "@/types";
import debtRepository from "@/repositories/debtRepository";
import debtValidator from "@/validators/debtValidator";

// Logica de negócio
class DebtService {
  // Cria um nova dívida
  async toCreateDebt(data: IDebtCreate): Promise<IServiceResponse<IDebt>> {
    // Valida dados de entrada
    const validate = debtValidator.validateCreate(data);
    if (!validate.valid) {
      return {
        success: false,
        errors: validate.errors,
      };
    }

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

  // Calcula estatística das dívidas
  async toCalculateStatistics(): Promise<IServiceResponse<IEstatisticas>> {
    try {
      const allDebts = await debtRepository.findAll();

      const stats: IEstatisticas = {
        total: allDebts.length,
        pending: allDebts.filter((d) => d.status === DebtStatus.PENDENTE)
          .length,
        paid: allDebts.filter((d) => d.status === DebtStatus.PAGO).length,
        totalAmount: allDebts.reduce(
          (sum, c) => sum + parseFloat(c.amount.toString()),
          0
        ),
        pendingAmount: allDebts
          .filter((d) => d.status === DebtStatus.PENDENTE)
          .reduce((sum, c) => sum + parseFloat(c.amount.toString()), 0),
        amountPaid: allDebts
          .filter((d) => d.status === DebtStatus.PAGO)
          .reduce((sum, c) => sum + parseFloat(c.amount.toString()), 0),
      };

      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro 404";
      console.error("Erro ao obter estatísticas:", errorMessage);
      throw new Error("Erro ao calcular estatísticas");
    }
  }

  // Atualiza status de uma dívida
  async toUpdateDebtStatus(
    id: DebtId,
    newStatus: DebtStatus
  ): Promise<IServiceResponse<IDebt>> {
    try {
      // Verifica se a dívida existe
      const existingDebt = await debtRepository.findById(id);
      if (!existingDebt) {
        return {
          success: false,
          errors: ["Dívida não encontrada"],
        };
      }

      // Verifica se já está no status desejado
      if (existingDebt.status === newStatus) {
        return {
          success: false,
          errors: [`Dívida já está no status  ${newStatus}`],
        };
      }

      // Atualiza status
      const updatedDebt = await debtRepository.updateStatus(id, newStatus);

      if (!updatedDebt) {
        return {
          success: false,
          errors: ["Erro ao atualizar status da dívida"],
        };
      }

      return {
        success: true,
        data: updatedDebt.toJSON(),
        message: `Status da dívida atualizado para ${newStatus}`,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro 404";
      console.error("Erro ao atualizar status:", errorMessage);
      throw new Error("Erro ao atualizar status da dívida");
    }
  }
}

export default new DebtService();
