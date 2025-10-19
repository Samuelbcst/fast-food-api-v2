import { Request } from "express"
import { makeGetPaymentByIdFactory } from "./make-payment-get-by-id-dependencies"

export const getPaymentById = async (params: Request["params"]) => {
    const id = Number(params.id)
    if (isNaN(id)) throw new Error("Id must be a number")
    const useCase = await makeGetPaymentByIdFactory()
    const result = await useCase.execute({ id })
    await useCase.onFinish()

    return result
}
