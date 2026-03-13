import axios from "axios"

const baseURL='http://localhost:4000'
const api = axios.create({baseURL})

export const getCobrancas = async () => {
  return api.get(`/cobrancas`)
}
export const postCobranca = async (cobranca) => {
  console.log('cliente: ',cobranca.cliente,'valor: ',cobranca.valor)
  return api.post(`/cobrancas`,cobranca)
}
export const putCobranca = async (id) => {
  return api.put(`/cobrancas/${id}`)
}