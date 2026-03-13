import Router from 'express'
import { getCobrancas, postCobranca, putCobranca } from './controller.js'

export const cobrancasRouter=Router()

cobrancasRouter.post('/cobrancas', postCobranca )
cobrancasRouter.get('/cobrancas', getCobrancas )
cobrancasRouter.put('/cobrancas/:id', putCobranca )