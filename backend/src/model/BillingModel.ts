export enum BillingStatus{
    PENDING = "PENDENTE",
    PAID = "PAGO"
}

export interface BillingModel{
    clientName: string
    value: number
    dueDate: Date
    status: BillingStatus
}
