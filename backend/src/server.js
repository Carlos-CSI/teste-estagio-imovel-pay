const express = require("express");
const cors = require("cors");
const cobrancaRoutes = require("./routes/cobrancaRoutes");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  const startedAt = Date.now();

  res.on("finish", () => {
    const elapsedMs = Date.now() - startedAt;
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${elapsedMs}ms)`);
  });

  next();
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/cobrancas", cobrancaRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Erro interno no servidor" });
});

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
