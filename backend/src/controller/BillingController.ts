import { Request, Response } from "express";
import { BillingRepository } from "../repository/BillingRepository";

export class BillingController {
    billingRepository: BillingRepository

    constructor(billingRepository: BillingRepository) {
        this.billingRepository = billingRepository
    }

    async find(req: Request, res: Response) {
        const billings = await this.billingRepository.find()
        res.status(200).json(billings)
    }

    async create(req: Request, res: Response) {
        const billing = req.body
        const newBilling = await this.billingRepository.create(billing)
        res.status(201).json(newBilling)
    }

    async update(req: Request, res: Response) {
        const id = req.params.id as string
        const status = req.body.status
        const billing = await this.billingRepository.update(parseInt(id), status)
        if (!billing) {
            res.status(404).json()
            return
        }
        res.status(200).json(billing)
    }
}
