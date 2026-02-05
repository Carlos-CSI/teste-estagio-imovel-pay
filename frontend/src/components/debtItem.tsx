import type { Debt, StatusInfo } from "../types";
import { cn, formatCurrency, formatDate, isExpired } from "../utils";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Check } from "lucide-react";

interface DebtItemProps {
  data: Debt;
}

export default function DebtItem({ data }: DebtItemProps) {
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

  const statusInfo = getStatusInfo(data.status);
  const expired = isExpired(data.expire_date, data.status);

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg border border-gray-200 p-5 transition-all duration-300 hover:shadow-lg",
        expired && "border-l-expired border-l-4",
      )}
    >
      <div className="flex-1 space-y-2.5">
        <div className="flex items-center gap-2.5 text-lg">
          <strong>{data.client_name}</strong>
          {expired && <Badge variant="expired">Vencida</Badge>}
        </div>

        <div className="flex flex-wrap gap-8">
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

      <div className="flex items-center">
        {data.status === "PENDENTE" && (
          <Button variant="forPaid">Marcar como pago</Button>
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
