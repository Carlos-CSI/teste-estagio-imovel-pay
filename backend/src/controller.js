import dayjs from 'dayjs'
import { createCobranca, selectCobrancas } from './repository.js'
export async function postCobranca (req,res){
    const {cliente,valor:valorString,dataVencimento}=req.body
    const valor=parseFloat(valorString)
    const dataCriacao=dayjs().format('YYYY-MM-DD hh:mm:ss')
    try {
        await createCobranca({
            cliente,valor,dataVencimento,dataCriacao
        })
        res.sendStatus(201)
    } catch (error) {
        console.log('Erro em controller postCobranca: ',error)
        res.sendStatus(500)
    }
}
export async function getCobrancas (req,res){
    try {
        const response=await selectCobrancas()
        res.status(200).send(response)
    } catch (error) {
        console.log('Erro em controller getCobrancas: ',error)
        res.sendStatus(500)
    }
}