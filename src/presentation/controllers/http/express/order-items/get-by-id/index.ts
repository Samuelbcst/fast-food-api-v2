import { Request } from "express"
import { makeGetOrderItemByIdFactory } from "./make-order-item-get-by-id-dependencies"

export const getOrderItemById = async (params: Request["params"]) => {
    const id = Number(params.id)
    if (isNaN(id)) throw new Error("Id must be a number")
    const useCase = await makeGetOrderItemByIdFactory()
    const result = await useCase.execute({ id })
    await useCase.onFinish()

    return result
}
