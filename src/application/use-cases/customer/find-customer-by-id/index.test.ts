import type { FindCustomerByIdOutputPort } from "@application/ports/output/customer/find-customer-by-id-output-port"
import { CustomError } from "@application/use-cases/custom-error"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { FindCustomerByIdUseCase } from "."

describe("FindCustomerByIdUseCase", () => {
    let repository: FindCustomerByIdOutputPort
    let useCase: FindCustomerByIdUseCase
    const input = { id: 1 }
    const customer = {
        id: 1,
        name: "Test",
        email: "test@example.com",
        cpf: "12345678900",
        createdAt: new Date(),
        updatedAt: new Date(),
    }

    beforeEach(() => {
        repository = {
            execute: vi.fn().mockResolvedValue(customer),
            finish: vi.fn().mockResolvedValue(undefined),
        }
        useCase = new FindCustomerByIdUseCase(repository)
    })

    it("should return success true and the customer when found", async () => {
        const result = await useCase.execute(input)
        expect(result.success).toBe(true)
        expect(result.result).toEqual(customer)
        expect(repository.execute).toHaveBeenCalledWith(input.id)
    })

    it("should return success false and CustomError when customer not found", async () => {
        repository.execute = vi.fn().mockResolvedValue(null)
        useCase = new FindCustomerByIdUseCase(repository)
        const result = await useCase.execute(input)
        expect(result.success).toBe(false)
        expect(result.result).toBeNull()
        expect(result.error).toBeInstanceOf(CustomError)
        expect(result.error?.message).toBe("Customer not found.")
    })

    it("should return success false on repository error", async () => {
        repository.execute = vi.fn().mockRejectedValue(new Error("fail"))
        useCase = new FindCustomerByIdUseCase(repository)
        const result = await useCase.execute(input)
        expect(result.success).toBe(false)
        expect(result.result).toBeNull()
    })

    it("should call finish on repository when onFinish is called", async () => {
        await useCase.onFinish()
        expect(repository.finish).toHaveBeenCalled()
    })
})
