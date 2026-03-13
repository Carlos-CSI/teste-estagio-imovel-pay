import Router from 'express'
import { getCobrancas, postCobranca } from './controller.js'

export const cobrancasRouter=Router()

cobrancasRouter.post('/cobrancas', postCobranca )
cobrancasRouter.get('/cobrancas', getCobrancas )