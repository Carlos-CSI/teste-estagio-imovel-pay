import { Router } from "express";
import debtController from "@/controllers/debtController";

const router = Router();

// Rotas para gerenciamento de cobrança -> /api/cobrancas
// POST /api/cobrancas - Criar nova cobrança
router.post("/", debtController.toCreate.bind(debtController));

// GET /api/cobrancas - Listar todas as cobranças
router.get("/", debtController.toList.bind(debtController));

// GET /api/cobrancas/estatisticas - Retorna estatísitcas das cobranças
router.get(
  "/estatisticas",
  debtController.toGetStatistics.bind(debtController)
);

// GET /api/cobrancas/:id - Buscar cobrança por ID
router.get("/:id", debtController.toFindById.bind(debtController));

// PATCH /api/cobrancas/:id/status - Atualizar status de uma cobrança
router.patch("/:id/status", debtController.toUpdateStatus.bind(debtController));

export default router;
