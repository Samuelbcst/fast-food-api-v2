import { PaymentStatus } from "@entities/payment/payment"
import { Request } from "express"
import { z } from "zod"
import { makeCreatePaymentFactory } from "./make-payment-create-dependencies"

export const createPayment = async ({}, body: Request["body"]) => {
    const { orderId, amount, paymentStatus, paidAt } = z
        .object({
            orderId: z.number().int().positive(),
            amount: z.number().positive(),
            paymentStatus: z.nativeEnum(PaymentStatus),
            paidAt: z.coerce.date().optional(),
        })
        .parse(body)

    const useCase = await makeCreatePaymentFactory()
    const input: any = { orderId, amount, paymentStatus }
    if (paidAt !== undefined) input.paidAt = paidAt
    const result = await useCase.execute(input)
    await useCase.onFinish()
    return result
}
