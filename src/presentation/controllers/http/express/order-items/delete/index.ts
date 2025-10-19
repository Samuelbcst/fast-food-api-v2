import { Request } from "express"
import { makeDeleteOrderItemFactory } from "./make-order-item-delete-dependencies"

export const deleteOrderItem = async (params: Request["params"]) => {
    const id = Number(params.id)
    if (isNaN(id)) throw new Error("Id must be a number")

    const useCase = await makeDeleteOrderItemFactory()
    const result = await useCase.execute({ id })
    await useCase.onFinish()

    return result
}
