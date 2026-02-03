import { ResultSetHeader, RowDataPacket } from "mysql2";
import { getPool } from "@/config/database";
import { DebtStatus, DebtId, IDebt, IDebtCreate, IDebtFilters } from "@/types";
import { Debt } from "@/models/debtModel";

// Acesso e manutenção dos dados
class DebtRepository {
  // Busca dívida por ID
  async findById(id: DebtId): Promise<Debt | null> {
    const pool = getPool();
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM debts WHERE id = ?",
      [id]
    );

    if (rows.length === 0) return null;
    return new Debt(rows[0] as IDebt);
  }

  // Cria novo dívida
  async create(data: IDebtCreate): Promise<Debt> {
    const pool = getPool();
    const [result] = await pool.execute<ResultSetHeader>(
      "INSERT INTO debts (client_name, amount, expire_date, status) VALUES (?, ?, ?, ?)",
      [
        data.client_name,
        data.amount,
        data.expire_date,
        data.status || DebtStatus.PENDENTE,
      ]
    );

    const created = await this.findById(result.insertId);
    if (!created) {
      throw new Error("Erro ao criar nova dívida");
    }
    return created;
  }

  // Lista todas as dívidas
  async findAll(filters: IDebtFilters = {}): Promise<Debt[]> {
    const pool = getPool();
    let query = "SELECT * FROM debts";
    const params: any[] = [];

    if (filters.status) {
      query += " WHERE status = ?";
      params.push(filters.status);
    }

    query += " ORDER BY expire_date DESC";

    const [rows] = await pool.execute<RowDataPacket[]>(query, params);
    return rows.map((row) => new Debt(row as IDebt));
  }
}

export default new DebtRepository();
