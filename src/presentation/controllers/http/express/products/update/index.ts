import { Request } from "express"
import { z } from "zod"
import { makeUpdateProductFactory } from "./make-product-update-dependencies"

export const updateProduct = async (
    params: Request["params"],
    body: Request["body"]
) => {
    const id = Number(params.id)
    if (isNaN(id)) throw new Error("Id must be a number")

    const { name, description, price, categoryId } = z
        .object({
            name: z.string().optional(),
            description: z.string().optional(),
            price: z.number().optional(),
            categoryId: z.number().optional(),
        })
        .parse(body)

    const useCase = await makeUpdateProductFactory()
    const result = await useCase.execute({
        id,
        name,
        description,
        price,
        categoryId,
    })
    await useCase.onFinish()

    return result
}
