import type { UpdateOrderItemRepository } from "@src/application/repositories/order-item/update-order-item"
import { CustomError } from "@use-cases/custom-error"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { UpdateOrderItemUseCase } from "."

describe("UpdateOrderItemUseCase", () => {
    let repository: UpdateOrderItemRepository
    let useCase: UpdateOrderItemUseCase
    const input = {
        id: 1,
        name: "prod",
        description: "desc",
        price: 10,
        categoryId: 2,
    }
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
        useCase = new UpdateOrderItemUseCase(repository)
    })

    it("should return success true and the updated order item when found", async () => {
        const result = await useCase.execute(input)
        expect(result.success).toBe(true)
        expect(result.result).toEqual(orderItem)
        expect(repository.execute).toHaveBeenCalledWith(input)
    })

    it("should return success false and CustomError when order item not found", async () => {
        repository.execute = vi.fn().mockResolvedValue(null)
        useCase = new UpdateOrderItemUseCase(repository)
        const result = await useCase.execute(input)
        expect(result.success).toBe(false)
        expect(result.result).toBeNull()
        expect(result.error).toBeInstanceOf(CustomError)
        expect(result.error?.message).toBe("Product not found.")
    })

    it("should return success false on repository error", async () => {
        repository.execute = vi.fn().mockRejectedValue(new Error("fail"))
        useCase = new UpdateOrderItemUseCase(repository)
        const result = await useCase.execute(input)
        expect(result.success).toBe(false)
        expect(result.result).toBeNull()
    })

    it("should call finish on repository when onFinish is called", async () => {
        await useCase.onFinish()
        expect(repository.finish).toHaveBeenCalled()
    })
})
