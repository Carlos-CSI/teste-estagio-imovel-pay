import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export default function DebtItem() {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 p-5 transition-all duration-300 hover:shadow-lg">
      <div className="flex-1 space-y-2.5">
        <div className="flex items-center gap-2.5 text-lg">
          <strong>João da Silva</strong>
        </div>

        <div className="flex flex-wrap gap-8">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-600 uppercase">Valor:</span>
            <span className="text-amount font-semibold">R$ 600,00</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-600 uppercase">Vencimento:</span>
            <span className="font-semibold text-gray-600">02/06/2026</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-600 uppercase">Valor:</span>
            <span className="text-amount font-medium">PENDENTE</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-600 uppercase">Status:</span>
            <Badge>Pendente</Badge>
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <Button variant="forPaid">Marcar como pago</Button>
      </div>
    </div>
  );
}
