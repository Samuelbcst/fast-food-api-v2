import { Request } from "express"
import { makeGetProductByIdFactory } from "./make-product-get-by-id-dependencies"

export const getProductById = async (params: Request["params"]) => {
    const id = Number(params.id)
    if (isNaN(id)) throw new Error("Id must be a number")
    const useCase = await makeGetProductByIdFactory()
    const result = await useCase.execute({ id })
    await useCase.onFinish()

    return result
}
