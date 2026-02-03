import { Router } from "express";
import debtController from "@/controllers/debtController";

const router = Router();

// Rotas para gerenciamento de dívida -> /api/dividas
// POST /api/dividas - Criar novo dívida
router.post("/", debtController.toCreate.bind(debtController));

// GET /api/dividas - Listar todas as dívidas
router.get("/", debtController.toList.bind(debtController));

// GET /api/dividas/estatisticas - Retorna estatísitcas das dívidas
router.get(
  "/estatisticas",
  debtController.toGetStatistics.bind(debtController)
);

// GET /api/dividas/:id - Buscar dívida por ID
router.get("/:id", debtController.toFindById.bind(debtController));

// PATCH /api/dividas/:id/status - Atualizar status de uma dívida
router.patch("/:id/status", debtController.toUpdateStatus.bind(debtController));

export default router;
