import Router from 'express'
import { connectDB } from '../../db.js'

export const clientesRouter=Router()

clientesRouter.get('/clientes', async (req,res)=>{
    const {ordenacao,asc}=req.query
    console.log(ordenacao,asc)
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
        res.status(200).send(rows)
    } catch (error) {
        console.log('Erro em repository selectCobrancas: ',error)
    }
} )