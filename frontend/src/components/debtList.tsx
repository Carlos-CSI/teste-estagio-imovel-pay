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
import Loading from "./loading";
import { Button } from "./ui/button";

interface DebtListProps {
  refreshList: number;
}

export default function DebtList({ refreshList }: DebtListProps) {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [filterStatus, setFilterStatus] = useState<StatusFilter>("TODOS");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Carrega os dados da API
  const loadDebts = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const filter = filterStatus === "TODOS" ? null : filterStatus;
      const response = await debtAPI.toListAll(filter);
      setDebts(response.data || []);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao carregar cobranças";
      setError(errorMessage);
      console.error("Erro ao carregar cobranças:", error);
    } finally {
      setLoading(false);
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

  // Carregar cobranças
  useEffect(() => {
    loadDebts();
  }, [filterStatus]);

  // Recarregar quando for atualizado
  useEffect(() => {
    if (refreshList) {
      loadDebts();
    }
  }, [refreshList]);

  if (loading) {
    return <Loading message="Carregando cobranças..." />;
  }

  if (error) {
    return (
      <div className="space-y-5 px-5 py-10 text-center">
        <p className="text-expired">{error}</p>
        <Button onClick={loadDebts}>Tentar novamente</Button>
      </div>
    );
  }

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
            {debts.length} {debts.length === 1 ? "cobrança" : "cobranças"}{" "}
            encontrada(s)
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
