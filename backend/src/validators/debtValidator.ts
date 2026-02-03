import { DebtStatus, type IDebtCreate, type IValidationResult } from "@/types";

// Centraliza todas as validações de entrada
class DebtValidator {
  // Valida dados para criação de cobrança
  validateCreate(data: Partial<IDebtCreate>): IValidationResult {
    const errors: string[] = [];

    // Nome do cliente
    if (!data.client_name || typeof data.client_name !== "string") {
      errors.push("Nome do cliente é obrigatório");
    } else if (data.client_name.trim().length < 3) {
      errors.push("Nome do cliente deve ter no mínimo 3 caracteres");
    } else if (data.client_name.trim().length > 255) {
      errors.push("Nome do cliente deve ter no máximo 255 caracteres");
    }

    // Valor da cobrança
    if (data.amount === undefined || data.amount === null) {
      errors.push("Valor é obrigatório");
    } else {
      const amount = parseFloat(data.amount.toString());
      if (isNaN(amount)) {
        errors.push("Valor deve ser um número válido");
      } else if (amount <= 0) {
        errors.push("Valor deve ser maior que zero");
      } else if (amount > 999999.99) {
        errors.push("Valor não pode exceder R$ 999.999,99");
      }
    }

    // Data de vencimento
    if (!data.expire_date) {
      errors.push("Data de vencimento é obrigatória");
    } else {
      const expire_date = new Date(data.expire_date);
      if (isNaN(expire_date.getTime())) {
        errors.push("Data de vencimento inválida");
      }

      // Valida se a data não está muito no passado
      const overAYearOld = new Date();
      overAYearOld.setFullYear(overAYearOld.getFullYear() - 1);
      if (expire_date < overAYearOld) {
        errors.push("Data de vencimento não pode ser anterior a um ano atrás");
      }
    }

    // Status
    if (data.status && !Object.values(DebtStatus).includes(data.status)) {
      errors.push("Status deve ser PENDENTE ou PAGO");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export default new DebtValidator();
