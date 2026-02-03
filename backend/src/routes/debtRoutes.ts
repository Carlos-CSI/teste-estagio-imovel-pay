import { Router } from "express";
import debtController from "@/controllers/debtController";

const router = Router();

// Rotas para gerenciamento de dívida -> /api/dividas
// POST /api/dividas - Criar novo dívida
router.post("/", debtController.toCreate.bind(debtController));

export default router;
