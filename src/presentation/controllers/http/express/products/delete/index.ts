import { Request } from "express"
import { makeDeleteProductFactory } from "./make-product-delete-dependencies"

export const deleteProduct = async (params: Request["params"]) => {
    const id = Number(params.id)
    if (isNaN(id)) throw new Error("Id must be a number")

    const useCase = await makeDeleteProductFactory()
    const result = await useCase.execute({ id })
    await useCase.onFinish()

    return result
}
