import type { FindCustomerAllRepository } from "@src/application/repositories/customer/find-customer-all"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { FindCustomerAllUseCase } from "."

describe("FindCustomerAllUseCase", () => {
    let repository: FindCustomerAllRepository
    let useCase: FindCustomerAllUseCase
    const customers = [
        {
            id: 1,
            name: "Test1",
            email: "test1@example.com",
            cpf: "12345678900",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 2,
            name: "Test2",
            email: "test2@example.com",
            cpf: "12345678901",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ]

    beforeEach(() => {
        repository = {
            execute: vi.fn().mockResolvedValue(customers),
            finish: vi.fn().mockResolvedValue(undefined),
        }
        useCase = new FindCustomerAllUseCase(repository)
    })

    it("should return success true and all customers", async () => {
        const result = await useCase.execute()
        expect(result.success).toBe(true)
        expect(result.result).toEqual(customers)
        expect(repository.execute).toHaveBeenCalled()
    })

    it("should return success false and empty array on repository error", async () => {
        repository.execute = vi.fn().mockRejectedValue(new Error("fail"))
        useCase = new FindCustomerAllUseCase(repository)
        const result = await useCase.execute()
        expect(result.success).toBe(false)
        expect(result.result).toEqual([])
    })

    it("should call finish on repository when onFinish is called", async () => {
        await useCase.onFinish()
        expect(repository.finish).toHaveBeenCalled()
    })
})
