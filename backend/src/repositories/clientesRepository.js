import { connectDB } from "../../db.js";

export async function selectClientes(ordenacao,asc){
    try {
        const db=await connectDB()
        const query = `
            SELECT 
                cliente,
                COUNT(CASE WHEN status = 'pendente' THEN 1 END) AS pendencias,
                SUM(CASE WHEN status = 'pendente' THEN Valor ELSE 0 END) AS valor_total
            FROM 
                cobrancas
            GROUP BY 
                cliente
            HAVING 
                COUNT(CASE WHEN status = 'pendente' THEN 1 END) > 0
            ORDER BY ${ordenacao} ${asc};
        `;
        const [rows] = await db.query(query,[]);
        return rows
    } catch (error) {
        console.log('Erro em repository selectClientes: ',error)
    }
}