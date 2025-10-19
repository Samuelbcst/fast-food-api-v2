import type { FindCustomerByCpfRepository } from "@src/application/repositories/customer/find-customer-by-cpf"
import { CustomError } from "@use-cases/custom-error"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { FindCustomerByCpfUseCase } from "."

describe("FindCustomerByCpfUseCase", () => {
    let repository: FindCustomerByCpfRepository
    let useCase: FindCustomerByCpfUseCase
    const input = { cpf: "12345678900" }
    const customer = {
        id: 1,
        name: "Test",
        email: "test@example.com",
        cpf: input.cpf,
        createdAt: new Date(),
        updatedAt: new Date(),
    }

    beforeEach(() => {
        repository = {
            execute: vi.fn().mockResolvedValue(customer),
            finish: vi.fn().mockResolvedValue(undefined),
        }
        useCase = new FindCustomerByCpfUseCase(repository)
    })

    it("should return success true and the customer when found", async () => {
        const result = await useCase.execute(input)
        expect(result.success).toBe(true)
        expect(result.result).toEqual(customer)
        expect(repository.execute).toHaveBeenCalledWith(input.cpf)
    })

    it("should return success false and CustomError when customer not found", async () => {
        repository.execute = vi.fn().mockResolvedValue(null)
        useCase = new FindCustomerByCpfUseCase(repository)
        const result = await useCase.execute(input)
        expect(result.success).toBe(false)
        expect(result.result).toBeNull()
        expect(result.error).toBeInstanceOf(CustomError)
        expect(result.error?.message).toBe("Customer not found.")
    })

    it("should return success false on repository error", async () => {
        repository.execute = vi.fn().mockRejectedValue(new Error("fail"))
        useCase = new FindCustomerByCpfUseCase(repository)
        const result = await useCase.execute(input)
        expect(result.success).toBe(false)
        expect(result.result).toBeNull()
    })

    it("should call finish on repository when onFinish is called", async () => {
        await useCase.onFinish()
        expect(repository.finish).toHaveBeenCalled()
    })
})
