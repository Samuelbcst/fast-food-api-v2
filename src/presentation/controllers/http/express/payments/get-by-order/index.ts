import { Request } from "express"
import { makeGetPaymentByOrderFactory } from "./make-payment-get-by-order-dependencies"

export const getPaymentByOrder = async (params: Request["params"]) => {
    const orderId = Number(params.orderId)
    if (Number.isNaN(orderId)) {
        throw new Error("orderId must be a number")
    }

    const useCase = await makeGetPaymentByOrderFactory()
    const result = await useCase.execute({ orderId })
    await useCase.onFinish()
    return result
}
