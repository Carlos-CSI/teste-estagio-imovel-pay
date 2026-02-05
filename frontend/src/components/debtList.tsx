import { useEffect, useState } from "react";
import { debtAPI } from "../services/api";
import type { Debt, DebtStatus, StatusFilter } from "../types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import DebtItem from "./debtItem";

export default function DebtList() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [filterStatus, setFilterStatus] = useState<StatusFilter>("TODOS");

  // Carrega os dados da API
  const loadDebts = async (): Promise<void> => {
    try {
      const filter = filterStatus === "TODOS" ? null : filterStatus;
      const response = await debtAPI.toListAll(filter);
      setDebts(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar cobranças:", error);
    }
  };

  // Atualiza o status de uma cobrança
  const handleStatusUpdated = async (
    id: number,
    newStatus: DebtStatus,
  ): Promise<void> => {
    try {
      await debtAPI.toUpdateStatus(id, newStatus);
      await loadDebts();
    } catch (error) {
      throw error;
    }
  };

  // Muda o filtro de status
  const handleFilterChange = (status: StatusFilter): void => {
    setFilterStatus(status);
  };

  useEffect(() => {
    loadDebts();
  }, [filterStatus]);

  return (
    <section className="space-y-6 rounded-lg bg-white p-8 shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Lista de Cobranças</h2>

        {/* Filtros de pesquisa */}
        <Select value={filterStatus} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-60">
            <SelectValue placeholder="Filtrar por status:" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="TODOS">Todos</SelectItem>
              <SelectItem value="PENDENTE">Pendentes</SelectItem>
              <SelectItem value="PAGO">Pagos</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Listagem de cobranças */}
      <div className="">
        <div className="mb-4 border-b border-gray-300 pb-2.5">
          <span className="text-sm font-medium text-gray-600">
            2 cobranças encontrada(s)
          </span>
        </div>
        <div className="space-y-4">
          {debts.map((debt) => (
            <DebtItem
              key={debt.id}
              data={debt}
              onStatusUpdated={handleStatusUpdated}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
