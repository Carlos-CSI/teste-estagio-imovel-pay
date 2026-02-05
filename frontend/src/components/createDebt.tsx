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
  const [submitErrors, setSubmitErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
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
    setLoading(true);
    setSubmitErrors([]);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="max-sm:w-full">
          <Plus className="size-4.5" />
          Criar cobrança
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Cobrança</DialogTitle>

          {submitErrors.length > 0 && (
            <div className="mb-5 rounded-sm border border-b-orange-200 bg-gray-50 p-3.5">
              {submitErrors.map((err, i) => (
                <p key={i} className="mt-1.5 text-sm text-red-500">
                  {err}
                </p>
              ))}
            </div>
          )}
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
                disabled={loading}
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
                disabled={loading}
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
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar cobrança"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
