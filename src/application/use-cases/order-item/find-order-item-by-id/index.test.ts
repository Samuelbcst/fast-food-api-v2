import type { FindOrderItemByIdRepository } from "@src/application/repositories/order-item/find-order-item-by-id"
import { CustomError } from "@use-cases/custom-error"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { FindOrderItemByIdUseCase } from "."

describe("FindOrderItemByIdUseCase", () => {
    let repository: FindOrderItemByIdRepository
    let useCase: FindOrderItemByIdUseCase
    const input = { id: 1 }
    const orderItem = {
        id: 1,
        orderId: 1,
        productId: 2,
        productName: "prod",
        unitPrice: 10,
        quantity: 2,
    }

    beforeEach(() => {
        repository = {
            execute: vi.fn().mockResolvedValue(orderItem),
            finish: vi.fn().mockResolvedValue(undefined),
        }
        useCase = new FindOrderItemByIdUseCase(repository)
    })

    it("should return success true and the order item when found", async () => {
        const result = await useCase.execute(input)
        expect(result.success).toBe(true)
        expect(result.result).toEqual(orderItem)
        expect(repository.execute).toHaveBeenCalledWith(input.id)
    })

    it("should return success false and CustomError when order item not found", async () => {
        repository.execute = vi.fn().mockResolvedValue(null)
        useCase = new FindOrderItemByIdUseCase(repository)
        const result = await useCase.execute(input)
        expect(result.success).toBe(false)
        expect(result.result).toBeNull()
        expect(result.error).toBeInstanceOf(CustomError)
        expect(result.error?.message).toBe("Order item not found.")
    })

    it("should return success false on repository error", async () => {
        repository.execute = vi.fn().mockRejectedValue(new Error("fail"))
        useCase = new FindOrderItemByIdUseCase(repository)
        const result = await useCase.execute(input)
        expect(result.success).toBe(false)
        expect(result.result).toBeNull()
    })

    it("should call finish on repository when onFinish is called", async () => {
        await useCase.onFinish()
        expect(repository.finish).toHaveBeenCalled()
    })
})
