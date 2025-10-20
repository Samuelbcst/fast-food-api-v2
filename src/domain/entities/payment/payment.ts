import { BaseEntity } from "@entities/base-entity"

export enum PaymentStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
}

export interface Payment extends BaseEntity {
    orderId: number
    amount: number
    paymentStatus: PaymentStatus
    paidAt?: Date | null
}
