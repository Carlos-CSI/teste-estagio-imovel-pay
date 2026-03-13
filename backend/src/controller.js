import dayjs from 'dayjs'
import { createCobranca, selectCobrancas, updateCobranca } from './repository.js'
export async function postCobranca (req,res){
    const {cliente}=req.body
    const {dataVencimento,valor}=res.locals
    try {
        const dataCriacao=dayjs().format('YYYY-MM-DD hh:mm:ss')
        console.log('passei')
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
    const {ordenacao,asc,filtro}=req.query
    try {
        const response=await selectCobrancas(ordenacao,asc,filtro)
        res.status(200).send(response)
    } catch (error) {
        console.log('Erro em controller getCobrancas: ',error)
        res.sendStatus(500)
    }
}
export async function putCobranca (req,res){
    const {id}=req.params
    try {
        await updateCobranca(parseInt(id))
        res.sendStatus(204)
    } catch (error) {
        console.log('Erro em controller putCobrancas: ',error)
        res.sendStatus(500)
    }
}
