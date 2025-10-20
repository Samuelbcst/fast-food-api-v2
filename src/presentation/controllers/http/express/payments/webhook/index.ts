import { PaymentStatus } from "@entities/payment/payment"
import { Request } from "express"
import { z } from "zod"

import { makePaymentWebhookFactory } from "./make-payment-webhook-dependencies"

const webhookSchema = z.object({
    orderId: z.number().int().positive(),
    status: z.nativeEnum(PaymentStatus),
    paidAt: z.union([z.coerce.date(), z.null()]).optional(),
})

export const handlePaymentWebhook = async (
    _: Request["params"],
    body: Request["body"]
) => {
    const payload = webhookSchema.parse(body)

    const useCase = await makePaymentWebhookFactory()
    const result = await useCase.execute(payload)
    await useCase.onFinish()
    return result
}
