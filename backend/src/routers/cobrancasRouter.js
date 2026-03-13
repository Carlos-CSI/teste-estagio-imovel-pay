import Router from 'express'
import { getCobrancas, postCobranca, putCobranca } from '../controllers/cobrancasController.js'
import { validatePostCobranca } from '../middlewares/validatePostCobranca.js'
import { validateGetCobranca } from '../middlewares/validateGetCobranca.js'

export const cobrancasRouter=Router()

cobrancasRouter.post('/cobrancas',validatePostCobranca, postCobranca )
cobrancasRouter.get('/cobrancas', validateGetCobranca, getCobrancas )
cobrancasRouter.put('/cobrancas/:id', putCobranca )
