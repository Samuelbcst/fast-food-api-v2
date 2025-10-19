import { Request } from "express"

import { makeDeleteCategoryFactory } from "./make-category-delete-dependencies"

export const deleteCategory = async (params: Request["params"]) => {
    const id = Number(params.id)
    if (isNaN(id)) throw new Error("Id must be a number")

    const useCase = await makeDeleteCategoryFactory()
    const result = await useCase.execute({ id })
    await useCase.onFinish()

    return result
}
