import { DebtStatus, IDebt, IDebtCreate, IServiceResponse } from "@/types";
import debtRepository from "@/repositories/debtRepository";

// Logica de negócio
class DebtService {
  // Cria um nova dívida
  async toCreateDebit(data: IDebtCreate): Promise<IServiceResponse<IDebt>> {
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
}

export default new DebtService();
