import z from "zod";

export const debtValidate = z.object({
  client_name: z.string().trim().min(1, "Nome do cliente é obrigatório"),
  amount: z.string().refine((a) => Number(a) > 0, {
    message: "Valor deve ser um número maior que zero",
  }),
  expire_date: z.string().min(1, "Data de vencimento é obrigatória"),
});

export type DebtFormData = z.infer<typeof debtValidate>;
