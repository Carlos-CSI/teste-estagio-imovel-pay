const express = require("express");
const router = express.Router();
const service = require("../services/cobrancas.service");

// LISTAR
router.get("/", (req, res) => {
  const cobrancas = service.listar();
  res.json(cobrancas);
});

// CRIAR
router.post("/", (req, res) => {
  const nova = service.criar(req.body);
  res.status(201).json(nova);
});

// 🔥 MARCAR COMO PAGO
router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const atualizada = service.atualizarStatus(id, status);

  if (!atualizada) {
    return res.status(404).json({ error: "Cobrança não encontrada" });
  }

  res.json(atualizada);
});

module.exports = router;

