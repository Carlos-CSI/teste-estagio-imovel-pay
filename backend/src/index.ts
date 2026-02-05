import express from "express"
import bodyParser from "body-parser"
import { BillingRepository } from "./repository/BillingRepository"
import { BillingController } from "./controller/BillingController"

const PORT = 3333
const app = express()

app.use(bodyParser.json())

const billingRepository = new BillingRepository()
const billingController = new BillingController(billingRepository)

app.get("/billings", billingController.find.bind(billingController))
app.post("/billings", billingController.create.bind(billingController))
app.patch("/billings/:id", billingController.update.bind(billingController))

app.listen(PORT, ()=> {
    console.log(`Server is running on http://localhost:${PORT}`)
})