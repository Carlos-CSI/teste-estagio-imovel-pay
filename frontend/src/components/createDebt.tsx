import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

export default function CreateDebtButton() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button>
          <Plus className="size-4.5" />
          Criar cobrança
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Cobrança</DialogTitle>
        </DialogHeader>

        <form className="mt-3">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome do Cliente: *</Label>
              <Input
                type="text"
                id="client_name"
                name="client_name"
                placeholder="Ex: João Silva"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Valor(R$): *</Label>
              <Input
                type="number"
                id="amount"
                name="amount"
                placeholder="Ex: 150.00"
                step={0.01}
                min={0.01}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Data de Vencimento: *</Label>
              <Input type="date" id="expire_date" name="expire_date" required />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2.5">
            <Button variant="secondary">Cancelar</Button>
            <Button>Salvar cobrança</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
