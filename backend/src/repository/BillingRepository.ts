import { randomUUID } from "node:crypto";
import { BillingModel, BillingStatus } from "../model/BillingModel";

interface BillingModelWithId extends BillingModel {
    id: string 
}

export class BillingRepository{
    billings: BillingModelWithId[] = []

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

