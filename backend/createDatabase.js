import dotenv from "dotenv";
import mysql from "mysql2/promise";
import { criarTabelas } from "./createTables.js";
dotenv.config({ path: "../.env" });

async function criarBanco() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
  });

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`
  );

  console.log("Banco criado ou já existente");

  await connection.end();
  await criarTabelas()
}

criarBanco();