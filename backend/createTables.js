import dotenv from "dotenv";
import mysql from "mysql2/promise";
dotenv.config({ path: "../.env" });

export async function criarTabelas() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  });

  await connection.query(`
    CREATE TABLE IF NOT EXISTS cobrancas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      cliente VARCHAR(100),
      valor DECIMAL(10,2),
      data_vencimento DATE,
      data_criacao DATETIME,
      status ENUM('PENDENTE','PAGO')
    )
  `);

  console.log("Tabela criada ou já existente");

  await connection.end();
}

