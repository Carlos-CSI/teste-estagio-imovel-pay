import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

// Permitindo qualquer página acessar o meu back-end

app.use(cors());

// Funcao de criar uma cobrança
app.post("/cobranca", async (req, res) => {
  await prisma.cobranca.create({
    data: {
      nome: req.body.nome,
      valor: Number(req.body.valor),
      vencimento: new Date(req.body.vencimento),
      status: req.body.status,
    },
  });

  res.status(201).json(req.body);
});

// Funcao de mostrar as cobranças

app.get("/cobranca", async (req, res) => {
  const cobrancas = await prisma.cobranca.findMany();

  res.status(200).json(cobrancas);
});

// Funcao de alterar os dados de uma cobrança

app.put("/cobranca/:id", async (req, res) => {
  //
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
});

// Funcao de Deletar uma cobrança
app.delete("/cobranca/:id", async (req, res) => {
  await prisma.cobranca.delete({
    where: {
      id: req.params.id,
    },
  });

  res.status(200).json({ message: "Cobrança deletada com sucesso!" });
});

app.listen(3000);
