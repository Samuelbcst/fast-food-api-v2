import { CustomError } from "@application/use-cases/custom-error"
import { Request } from "express"
import { z } from "zod"

import { makeUpdateCustomerFactory } from "./make-customer-update-dependencies"

export const updateCustomer = async (
    params: Request["params"],
    body: Request["body"]
) => {
    const id = Number(params.id)
    if (isNaN(id)) throw new Error("Id must be a number")
    try {
        const { name, email, cpf } = z
            .object({
                name: z.string().min(1, "Name is required"),
                email: z.string().email("Valid email is required").optional(),
                cpf: z.string().min(1, "CPF is required").optional(),
            })
            .parse(body)

        const useCase = await makeUpdateCustomerFactory()
        const result = await useCase.execute({ id, name, email, cpf })
        await useCase.onFinish()
        return result
    } catch (error) {
        if (error instanceof z.ZodError) {
            const { CustomError } = await import("@application/use-cases/custom-error")
            const customError = new CustomError(
                "Validation error",
                400
            ) as CustomError & { details?: unknown }
            customError.details = error.errors
            return {
                success: false,
                result: null,
                error: customError,
            }
        }
        throw error
    }
}
