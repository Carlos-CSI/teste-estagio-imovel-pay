import { randomUUID } from "node:crypto";
import { BillingModel, BillingStatus } from "../model/BillingModel";

interface BillingModelWithId extends BillingModel {
    id: string 
}

export class BillingRepository{
    billings: BillingModelWithId[] = [
    {
        "clientName": "Pedro Santoro",
        "value": 10,
        "dueDate": new Date("2023-10-01"),
        "status": BillingStatus.PAID,
        "id": "ae3647f6-7b0e-4dd2-8591-40ab2a5fa48d"
    },
    {
        "clientName": "Gabriel Veliago",
        "value": 2000,
        "dueDate":  new Date("2025-10-02"),
        "status": BillingStatus.PENDING,
        "id": "0e6d06c7-2e06-4a40-8773-faf6378d9743"
    }
]

    find() {
        return this.billings
    }

    create(billing:BillingModel) {
        const billingWithId = {...billing, id:randomUUID()}
        this.billings.push(billingWithId)
        return billingWithId
    }

    update (id: string, status: BillingStatus) {
        const billing = this.billings.find((item)=> {
            return item.id === id 
        })
        if (!billing){
            return null
        }
        billing.status = status
        return billing
    }
}

