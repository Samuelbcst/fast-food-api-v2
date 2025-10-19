import { Request } from "express"
import { makeDeleteOrderFactory } from "./make-order-delete-dependencies"

export const deleteOrder = async (params: Request["params"]) => {
    const id = Number(params.id)
    if (isNaN(id)) throw new Error("Id must be a number")
    const useCase = await makeDeleteOrderFactory()
    const result = await useCase.execute({ id })
    await useCase.onFinish()
    return result
}
