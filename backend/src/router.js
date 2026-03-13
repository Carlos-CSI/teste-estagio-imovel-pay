import Router from 'express'
import { postCobranca } from './controller.js'

export const cobrancasRouter=Router()

cobrancasRouter.post('/cobrancas', postCobranca )