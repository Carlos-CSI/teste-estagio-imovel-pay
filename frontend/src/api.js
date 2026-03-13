import axios from "axios"

const baseURL='http://localhost:4000'
const api = axios.create({baseURL})

export const postCobranca = async (cobranca) => {
  return api.post(`/cobrancas`,cobranca)
}