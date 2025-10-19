import { Request } from "express"
import { makeGetOrderByIdFactory } from "./make-order-get-by-id-dependencies"

export const getOrderById = async (params: Request["params"]) => {
    const id = Number(params.id)
    if (isNaN(id)) throw new Error("Id must be a number")
    const useCase = await makeGetOrderByIdFactory()
    const result = await useCase.execute({ id })
    await useCase.onFinish()
    return result
}
