import express, { Application, Request, Response } from "express";
import cors from "cors";

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

export default app;
