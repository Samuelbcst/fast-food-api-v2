import { Request } from "express"
import { z } from "zod"
import { makeCreateOrderFactory } from "./make-order-create-dependencies"

export const createOrder = async ({}, body: Request["body"]) => {
    const { customerId, items } = z
        .object({
            customerId: z.number().int().positive().optional(),
            items: z
                .array(
                    z.object({
                        productId: z.number().int().positive(),
                        quantity: z.number().int().positive(),
                    })
                )
                .min(1),
        })
        .parse(body)

    const useCase = await makeCreateOrderFactory()
    const result = await useCase.execute({
        customerId: customerId,
        items,
    })
    await useCase.onFinish()
    return result
}
