import { PaymentStatus } from "@entities/payment/payment"
import { Request } from "express"
import { z } from "zod"
import { makeUpdatePaymentFactory } from "./make-payment-update-dependencies"

export const updatePayment = async (
    params: Request["params"],
    body: Request["body"]
) => {
    const id = Number(params.id)
    if (isNaN(id)) throw new Error("Id must be a number")

    const payload = z
        .object({
            paymentStatus: z.nativeEnum(PaymentStatus).optional(),
            paidAt: z.union([z.coerce.date(), z.null()]).optional(),
            amount: z.number().positive().optional(),
        })
        .parse(body)

    const useCase = await makeUpdatePaymentFactory()
    const result = await useCase.execute({ id, ...payload })
    await useCase.onFinish()
    return result
}
