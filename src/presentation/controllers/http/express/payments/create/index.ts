import { Request } from "express"
import { z } from "zod"
import { makeCreatePaymentFactory } from "./make-payment-create-dependencies"

export const createPayment = async ({}, body: Request["body"]) => {
    const { orderId, amount } = z
        .object({
            orderId: z.number().int().positive(),
            amount: z.number().positive().optional(),
        })
        .parse(body)

    const useCase = await makeCreatePaymentFactory()
    const result = await useCase.execute({ orderId, amount })
    await useCase.onFinish()
    return result
}
