import { Router } from "express";
import debtController from "@/controllers/debtController";

const router = Router();

// Rotas para gerenciamento de dívida -> /api/dividas
// POST /api/dividas - Criar novo dívida
router.post("/", debtController.toCreate.bind(debtController));

// GET /api/dividas - Listar todas as dívidas
router.get("/", debtController.toList.bind(debtController));

// GET /api/dividas/:id - Buscar dívida por ID
router.get("/:id", debtController.toFindById.bind(debtController));

export default router;
