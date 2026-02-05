import { useState, type ChangeEvent, type SubmitEvent } from "react";
import type { DebtCreate } from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { getCurrentDate } from "../utils";
import { Plus } from "lucide-react";

interface CreateDebtButtonProps {
  onCreatedDebt: (data: DebtCreate) => Promise<void>;
}

export default function CreateDebtButton({
  onCreatedDebt,
}: CreateDebtButtonProps) {
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState<DebtCreate>({
    client_name: "",
    amount: "",
    expire_date: getCurrentDate(),
  });

  // Atualiza os valores do formulário
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submete o formulário
  const handleSubmit = async (
    e: SubmitEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    try {
      await onCreatedDebt(formData);

      setFormData({
        client_name: "",
        amount: 0,
        expire_date: getCurrentDate(),
      });

      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4.5" />
          Criar cobrança
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Cobrança</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-3">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome do Cliente: *</Label>
              <Input
                type="text"
                id="client_name"
                name="client_name"
                placeholder="Ex: João Silva"
                value={formData.client_name}
                onChange={handleChange}
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
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Data de Vencimento: *</Label>
              <Input
                type="date"
                id="expire_date"
                name="expire_date"
                value={formData.expire_date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2.5">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Salvar cobrança</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
