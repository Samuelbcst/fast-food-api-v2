import { Request } from "express"
import { makeDeletePaymentFactory } from "./make-payment-delete-dependencies"

export const deletePayment = async (params: Request["params"]) => {
    const id = Number(params.id)
    if (isNaN(id)) throw new Error("Id must be a number")

    const useCase = await makeDeletePaymentFactory()
    const result = await useCase.execute({ id })
    await useCase.onFinish()

    return result
}
