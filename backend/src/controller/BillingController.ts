import { Request, Response } from "express";
import { BillingRepository } from "../repository/BillingRepository";

export class BillingController{
    billingRepository: BillingRepository

    constructor(billingRepository: BillingRepository){
        this.billingRepository = billingRepository 
    }

    find(req: Request, res: Response){
        const billings = this.billingRepository.find()
        res.status(200).json(billings)
    }

    create(req: Request, res: Response){
        const billing = req.body
        const newBilling = this.billingRepository.create(billing)
        res.status(201).json(newBilling)
    }

    update(req: Request, res: Response){
        const id = req.params.id as string
        const status = req.body.status
        const billing = this.billingRepository.update(id, status)
        if (!billing){
            res.status(404)
            return
        }
        res.status(200).json(billing)
    }
}
