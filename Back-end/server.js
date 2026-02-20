import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

// Permitindo qualquer página acessar o meu back-end

app.use(cors());

// Rota responsável por criar uma cobrança
app.post("/cobranca", async (req, res) => {
  try {
    await prisma.cobranca.create({
      data: {
        nome: req.body.nome,
        valor: Number(req.body.valor),
        vencimento: new Date(req.body.vencimento),
        status: req.body.status,
      },
    });

    res.status(201).json(req.body);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erro ao criar cobrança.",
    });
  }
});

// Rota responsável por listar todas as cobranças

app.get("/cobranca", async (req, res) => {
  try {
    const cobrancas = await prisma.cobranca.findMany();
    res.status(200).json(cobrancas);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erro ao buscar cobranças.",
    });
  }
});

// Rota responsável por alterar os dados de uma cobrança

// Rota responsável por alterar os dados de uma cobrança
app.put("/cobranca/:id", async (req, res) => {
  try {
    await prisma.cobranca.update({
      where: {
        id: req.params.id,
      },
      data: {
        nome: req.body.nome,
        valor: req.body.valor,
        vencimento: req.body.vencimento,
        status: req.body.status,
      },
    });

    res.status(201).json(req.body);
  } catch (error) {
    console.error("Erro ao atualizar cobrança:", error);

    res.status(500).json({
      message: "Erro ao atualizar cobrança.",
    });
  }
});

// Rota responsável pora Deletar uma cobrança
app.delete("/cobranca/:id", async (req, res) => {
  try {
    await prisma.cobranca.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({ message: "Cobrança deletada com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar cobrança:", error);

    res.status(500).json({
      message: "Erro ao deletar cobrança.",
    });
  }
});

app.listen(3000);
