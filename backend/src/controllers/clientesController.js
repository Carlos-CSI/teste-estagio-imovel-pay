import { selectClientes } from "../repositories/clientesRepository.js"

export async function getClientes(req,res){
    const {ordenacao,asc}=req.query
    try {
        const response=await selectClientes(ordenacao,asc)
        res.status(200).send(response)
    } catch (error) {
        console.log('Erro em controller getClientes: ',error)
        res.sendStatus(500)
    }
}