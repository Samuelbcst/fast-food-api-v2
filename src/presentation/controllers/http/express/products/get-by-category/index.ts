import { Request } from "express"
import { makeGetProductByCategoryFactory } from "./make-product-get-by-category-dependencies"

export const getProductByCategory = async (params: Request["params"]) => {
    const { categoryId } = params
    if (!categoryId) throw new Error("categoryId is required")
    const useCase = await makeGetProductByCategoryFactory()
    const result = await useCase.execute({ categoryId: Number(categoryId) })
    await useCase.onFinish()
    return result
}
