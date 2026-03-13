import axios from "axios"

const baseURL='http://localhost:4000'
const api = axios.create({baseURL})

export const getCobrancas = async () => {
  return api.get(`/cobrancas`)
}
export const postCobranca = async (cobranca) => {
  return api.post(`/cobrancas`,cobranca)
}
export const putCobranca = async (id) => {
  console.log('id que chegou no api',id)
  return api.put(`/cobrancas/${id}`)
}