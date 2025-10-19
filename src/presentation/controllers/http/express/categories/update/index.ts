import { Request } from "express"
import { z } from "zod"

import { makeUpdateCategoryFactory } from "./make-category-update-dependencies"

export const updateCategory = async (
    params: Request["params"],
    body: Request["body"]
) => {
    const id = Number(params.id)
    if (isNaN(id)) throw new Error("Id must be a number")

    const { name, description } = z
        .object({
            name: z.string().min(1, "Name is required"),
            description: z.string().optional(),
        })
        .parse(body)

    const useCase = await makeUpdateCategoryFactory()
    const result = await useCase.execute({ id, name, description })
    await useCase.onFinish()

    return result
}
