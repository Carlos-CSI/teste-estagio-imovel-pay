import Router from 'express'
import { validateGetClientes } from '../middlewares/validateGetClientes.js'
import { getClientes, putCliente } from '../controllers/clientesController.js'

export const clientesRouter=Router()

clientesRouter.get('/clientes', validateGetClientes, getClientes )
clientesRouter.put('/clientes/:cliente', putCliente )