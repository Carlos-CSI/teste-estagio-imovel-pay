import { connectDB } from '../db.js'

export async function createCobranca (cobranca){
    const {cliente,valor,dataVencimento,dataCriacao}=cobranca
    try {
        const db=await connectDB()
        const query = `
            INSERT INTO cobrancas (cliente, valor, data_vencimento, data_criacao, status)
            VALUES (?,?,?,?,'PENDENTE')
        `;
        await db.query(query, [cliente,valor,dataVencimento,dataCriacao]);
    } catch (error) {
        console.log('Erro em repository createCobranca: ',error)
    }
}

export async function selectCobrancas (ordenacao,asc,filtro){
    try {
        const db=await connectDB()
        const query = `
            SELECT * FROM cobrancas 
            ${filtro=='TODOS'?'':`WHERE status = '${filtro}'`}
            ORDER BY ${ordenacao} ${asc}
        `;
        const [rows] = await db.query(query,[]);
        return rows;
    } catch (error) {
        console.log('Erro em repository selectCobrancas: ',error)
    }
}
export async function updateCobranca (id){
    try {
        const db=await connectDB()
        const query = `
            UPDATE cobrancas 
            SET status = 'PAGO'
            WHERE id= ?
        `;
        await db.query(query,[id]);
    } catch (error) {
        console.log('Erro em repository updateCobrancas: ',error)
    }
}