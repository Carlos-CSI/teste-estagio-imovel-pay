import cors from 'cors'
import Express, {json} from 'express'

import { cobrancasRouter } from './src/routers/cobrancasRouter.js';
import { clientesRouter } from './src/routers/clientesRouter.js';


const app=Express()
app.use(cors())
app.use(json())


app.use(cobrancasRouter)
app.use(clientesRouter)

const port =process.env.PORT||4000
app.listen(port,()=>console.log(`listening on port ${port}`))