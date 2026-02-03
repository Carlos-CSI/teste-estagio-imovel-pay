import mysql from "mysql2/promise";
import type { IDatabaseConfig } from "@/types";

// Configuração da conexão com o banco de dados MySQL
// Usando variáveis de ambiente para maior segurança
const dbConfig: IDatabaseConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "admin",
  database: process.env.DB_DATABASE || "debt_system",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool: mysql.Pool | null = null;

// Cria e retorna conexões do MySQL
export const getPool = () => {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
};

// Testa a conexão com o banco de dados
export const testConnection = async (): Promise<boolean> => {
  try {
    const connection = await getPool().getConnection();
    console.log("Conexão com banco de dados estabelecida!");
    connection.release();
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erro 404";
    console.error("Falha ao conectar com o banco de dados:", errorMessage);
    return false;
  }
};
