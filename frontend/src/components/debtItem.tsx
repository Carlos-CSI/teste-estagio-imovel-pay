import { useState } from "react";
import { DebtStatus, type Debt, type StatusInfo } from "../types";
import { cn, formatCurrency, formatDate, isExpired } from "../utils";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Check } from "lucide-react";

interface DebtItemProps {
  data: Debt;
  onStatusUpdated: (id: number, status: DebtStatus) => Promise<void>;
}

export default function DebtItem({ data, onStatusUpdated }: DebtItemProps) {
  const [loading, setLoading] = useState<boolean>(false);

  // Determina a variante do badge com base na classe de status
  const getBadgeVariant = (statusClass: string): "pending" | "paid" => {
    switch (statusClass) {
      case "status-pending":
        return "pending";
      case "status-paid":
        return "paid";
      default:
        return "pending";
    }
  };

  const getStatusInfo = (status: string): StatusInfo => {
    if (status === "PAGO") {
      return { label: "Pago", class: "status-paid", variant: "paid" };
    }
    return { label: "Pendente", class: "status-pending", variant: "pending" };
  };

  // Marca a cobrança como paga
  const handleMarkAsPaid = async (): Promise<void> => {
    if (window.confirm("Deseja marcar esta cobrança como paga?")) {
      setLoading(true);
      try {
        await onStatusUpdated(data.id, DebtStatus.PAGO);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Erro 404";
        alert("Erro ao atualizar status: " + errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const statusInfo = getStatusInfo(data.status);
  const expired = isExpired(data.expire_date, data.status);

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg border border-gray-200 p-5 transition-all duration-300 hover:shadow-lg max-md:flex-col max-md:gap-2.5",
        expired && "border-l-expired border-l-4",
      )}
    >
      <div className="flex-1 space-y-2.5 max-md:w-full">
        <div className="flex items-center gap-2.5 text-lg">
          <strong>{data.client_name}</strong>
          {expired && <Badge variant="expired">Vencida</Badge>}
        </div>

        <div className="flex flex-wrap gap-8 max-md:justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-600 uppercase">Valor:</span>
            <span className="text-amount font-semibold">
              {formatCurrency(data.amount)}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-600 uppercase">Vencimento:</span>
            <span className="font-semibold text-gray-600">
              {formatDate(data.expire_date)}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-600 uppercase">Status:</span>
            <Badge variant={getBadgeVariant(statusInfo.class)}>
              {statusInfo.label}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex items-center max-md:w-full max-md:justify-center">
        {data.status === "PENDENTE" && (
          <Button
            className="max-md:w-full"
            onClick={handleMarkAsPaid}
            variant="forPaid"
            disabled={loading}
          >
            {loading ? "Processando..." : "Marcar como pago"}
          </Button>
        )}
        {data.status === "PAGO" && (
          <span className="text-paid flex items-center gap-2 font-semibold">
            <Check />
            Pago
          </span>
        )}
      </div>
    </div>
  );
}
