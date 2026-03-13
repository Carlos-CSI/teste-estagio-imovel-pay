import Router from 'express'
import { getCobrancas, postCobranca, putCobranca } from './controller.js'
import { validatePostCobranca } from './middlewares/validatePost.js'
import { validateGetCobranca } from './middlewares/validateGet.js'

export const cobrancasRouter=Router()

cobrancasRouter.post('/cobrancas',validatePostCobranca, postCobranca )
cobrancasRouter.get('/cobrancas', validateGetCobranca, getCobrancas )
cobrancasRouter.put('/cobrancas/:id', putCobranca )