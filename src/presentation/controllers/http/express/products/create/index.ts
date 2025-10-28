import { Request } from "express"
import { z } from "zod"
import { makeCreateProductFactory } from "./make-product-create-dependencies"

export const createProduct = async ({}, body: Request["body"]) => {
    const { name, description, price, categoryId, active } = z
        .object({
            name: z.string().min(1, "Name is required"),
            description: z.string().optional(),
            price: z.number().positive(),
            categoryId: z.number().int().positive(),
            active: z.boolean().optional(),
        })
        .parse(body)

    const useCase = await makeCreateProductFactory()
    const result = await useCase.execute({
        name,
        description,
        price,
        categoryId: categoryId.toString(),
        active,
    })
    await useCase.onFinish()
    return result
}
