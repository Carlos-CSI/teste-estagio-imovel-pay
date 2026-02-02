import dotenv from "dotenv";
import app from "./app";

dotenv.config();

// Inicialização do Servidor
const PORT = process.env.PORT || 3001;

const startServer = () => {
  // Iniciar servidor
  app.listen(PORT, () => {
    console.log("✅ Servidor rodando com sucesso!");
  });
};

startServer();
