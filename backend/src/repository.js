import { connectDB } from '../db.js'

export async function createCobranca (cobranca){
    const {cliente,valor,dataVencimento,dataCriacao}=cobranca
    try {
        const db=await connectDB()
        const query = `
            INSERT INTO cobrancas (cliente, valor, data_vencimento, data_criacao, status)
            VALUES (?,?,?,?,'PENDENTE')
        `;
        const [result] = await db.query(query, [cliente,valor,dataVencimento,dataCriacao]);
        return result.insertId;
    } catch (error) {
        console.log('Erro em repository createCobranca: ',error)
    }
}

export async function selectCobrancas (){
    try {
        const db=await connectDB()
        const query = `
            SELECT * FROM cobrancas 
        `;
        const [rows] = await db.query(query,[]);
        return rows;
    } catch (error) {
        console.log('Erro em repository selectCobrancas: ',error)
    }
}