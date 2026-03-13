import { selectClientes, updateCliente } from "../repositories/clientesRepository.js"

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
export async function putCliente(req,res){
    const {cliente}=req.params
    try {
        await updateCliente(cliente)
        res.sendStatus(204)
    } catch (error) {
        console.log('Erro em controller getClientes: ',error)
        res.sendStatus(500)
    }
}