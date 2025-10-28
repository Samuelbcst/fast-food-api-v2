import { CustomError } from "@application/use-cases/custom-error"
import { Request } from "express"
import { ZodError, z } from "zod"

import { makeCreateCustomerFactory } from "./make-customer-create-dependencies"

export const createCustomer = async ({}, body: Request["body"]) => {
    try {
        const { name, email, cpf } = z
            .object({
                name: z.string().min(1, "Name is required"),
                email: z.string().email("Valid email is required"),
                cpf: z.string().min(1, "CPF is required"),
            })
            .parse(body)

    const useCase = await makeCreateCustomerFactory()
    // The use-case input type currently expects a domain-shaped type. Cast
    // the plain DTO to any to keep this controller small and focused while
    // we migrate input-port types to plain DTOs.
    const result = await useCase.execute({ name, email, cpf } as any)
        await useCase.onFinish()
        return result
    } catch (error) {
        if (error instanceof ZodError) {
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
        const customError = new CustomError(
            (error as Error).message || "Unknown error",
            500
        )
        return {
            success: false,
            result: null,
            error: customError,
        }
    }
}
