import express, { Application, Request, Response } from "express";
import cors from "cors";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";
import debtRoutes from "@/routes/debtRoutes";

// Configuração principal da aplicação Express
const app: Application = express();

// Middlewares Globais
// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Parser de JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log de requisições
if (process.env.NODE_ENV === "development") {
  app.use((req: Request, res: Response, next) => {
    console.log(req.method, req.path);
    next();
  });
}

// Rotas da API
app.use("/api/dividas", debtRoutes);

// Tratamentos de erros
app.use(notFoundHandler); // Handler de rotas não encontradas (404)
app.use(errorHandler); // Handler de erros global

export default app;
