import { Request } from "express"
import { z } from "zod"
import { makeUpdatePaymentFactory } from "./make-payment-update-dependencies"

export const updatePayment = async (
    params: Request["params"],
    body: Request["body"]
) => {
    const id = Number(params.id)
    if (isNaN(id)) throw new Error("Id must be a number")

    const { paymentStatus } = z
        .object({
            paymentStatus: z.string().optional(),
        })
        .parse(body)

    const useCase = await makeUpdatePaymentFactory()
    const result = await useCase.execute({ id, status: paymentStatus })
    await useCase.onFinish()
    return result
}
