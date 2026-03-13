import axios from "axios"

const baseURL='http://localhost:4000'
const api = axios.create({
  baseURL,
 validateStatus: status => status >= 200 && status < 300
})

export const getCobrancas = async (ordenacao,crescente,filtro) => {
  return api.get(`/cobrancas?ordenacao=${ordenacao}&asc=${crescente?'ASC':'DESC'}&filtro=${filtro}`)
}
export const getClientes = async (ordenacao,crescente) => {
  return api.get(`/clientes?ordenacao=${ordenacao}&asc=${crescente?'ASC':'DESC'}`)
}
export const postCobranca = async (cobranca) => {
  return api.post(`/cobrancas`,cobranca)
}
export const putCobranca = async (id) => {
  return api.put(`/cobrancas/${id}`)
}