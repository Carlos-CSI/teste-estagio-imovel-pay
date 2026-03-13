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
        cliente VARCHAR(100) NOT NULL,
        valor DECIMAL(10,2) NOT NULL,
        data_vencimento DATE NOT NULL,
        data_criacao DATETIME NOT NULL,
        status ENUM('PENDENTE','PAGO') NOT NULL
    );
  `);
  console.log("Tabela criada ou já existente");
  await connection.end();
}

