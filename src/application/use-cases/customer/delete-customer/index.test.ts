import type { DeleteCustomerRepository } from "@src/application/repositories/customer/delete-customer"
import { CustomError } from "@use-cases/custom-error"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { DeleteCustomerUseCase } from "."

describe("DeleteCustomerUseCase", () => {
    let repository: DeleteCustomerRepository
    let useCase: DeleteCustomerUseCase
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
        useCase = new DeleteCustomerUseCase(repository)
    })

    it("should return success true and the deleted customer when found", async () => {
        const result = await useCase.execute(input)
        expect(result.success).toBe(true)
        expect(result.result).toEqual(customer)
        expect(repository.execute).toHaveBeenCalledWith(input)
    })

    it("should return success false and CustomError when customer not found", async () => {
        repository.execute = vi.fn().mockResolvedValue(null)
        useCase = new DeleteCustomerUseCase(repository)
        const result = await useCase.execute(input)
        expect(result.success).toBe(false)
        expect(result.result).toBeNull()
        expect(result.error).toBeInstanceOf(CustomError)
        expect(result.error?.message).toBe("Customer not found.")
    })

    it("should return success false on repository error", async () => {
        repository.execute = vi.fn().mockRejectedValue(new Error("fail"))
        useCase = new DeleteCustomerUseCase(repository)
        const result = await useCase.execute(input)
        expect(result.success).toBe(false)
        expect(result.result).toBeNull()
    })

    it("should call finish on repository when onFinish is called", async () => {
        await useCase.onFinish()
        expect(repository.finish).toHaveBeenCalled()
    })
})
