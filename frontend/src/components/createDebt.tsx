import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { debtValidate, type DebtFormData } from "../utils/debtValidate";
import { getCurrentDate } from "../utils";
import { Plus } from "lucide-react";

interface CreateDebtButtonProps {
  onCreatedDebt: (data: DebtCreate) => Promise<void>;
}

export default function CreateDebtButton({
  onCreatedDebt,
}: CreateDebtButtonProps) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DebtFormData>({
    resolver: zodResolver(debtValidate),
    defaultValues: {
      client_name: "",
      amount: "",
      expire_date: getCurrentDate(),
    },
  });

  // Submete o formulário
  const onSubmit = async (data: DebtFormData) => {
    try {
      await onCreatedDebt(data);
      reset({
        client_name: "",
        amount: "",
        expire_date: getCurrentDate(),
      });
      setOpen(false);
    } catch (error) {
      console.error("Erro ao criar cobrança:", error);
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

        <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome do Cliente: *</Label>
              <Input
                type="text"
                id="client_name"
                placeholder="Ex: João Silva"
                {...register("client_name")}
                required
              />
              {errors.client_name && (
                <p className="text-sm text-red-500">
                  {errors.client_name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Valor(R$): *</Label>
              <Input
                type="number"
                id="amount"
                placeholder="Ex: 150.00"
                step={0.01}
                min={0.01}
                {...register("amount")}
                disabled={isSubmitting}
              />
              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Data de Vencimento: *</Label>
              <Input
                type="date"
                id="expire_date"
                {...register("expire_date")}
                disabled={isSubmitting}
              />
              {errors.expire_date && (
                <p className="text-sm text-red-500">
                  {errors.expire_date.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2.5">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar cobrança"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
