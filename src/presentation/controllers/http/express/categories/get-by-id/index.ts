import { Request } from "express"

import { makeGetCategoryByIdFactory } from "./make-category-get-by-id-dependencies"

export const getCategoryById = async (params: Request["params"]) => {
    const id = Number(params.id)
    if (isNaN(id)) throw new Error("Id must be a number")
    const useCase = await makeGetCategoryByIdFactory()
    const result = await useCase.execute({ id })
    await useCase.onFinish()

    return result
}
