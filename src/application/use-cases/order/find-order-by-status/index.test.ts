import { OrderStatus } from "@entities/order/order"
import type { FindOrderByStatusRepository } from "@src/application/repositories/order/find-order-by-status"
import { CustomError } from "@use-cases/custom-error"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { FindOrderByStatusUseCase } from "."

describe("FindOrderByStatusUseCase", () => {
    let repository: FindOrderByStatusRepository
    let useCase: FindOrderByStatusUseCase
    const input = { status: OrderStatus.RECEIVED }
    const orders = [
        {
            id: 1,
            items: [],
            status: OrderStatus.RECEIVED,
            createdAt: new Date(),
            updatedAt: new Date(),
            statusUpdatedAt: new Date(),
            totalAmount: 100,
        },
        {
            id: 2,
            items: [],
            status: OrderStatus.RECEIVED,
            createdAt: new Date(),
            updatedAt: new Date(),
            statusUpdatedAt: new Date(),
            totalAmount: 200,
        },
    ]

    beforeEach(() => {
        repository = {
            execute: vi.fn().mockResolvedValue(orders),
            finish: vi.fn().mockResolvedValue(undefined),
        }
        useCase = new FindOrderByStatusUseCase(repository)
    })

    it("should return success true and all orders for the status", async () => {
        const result = await useCase.execute(input)
        expect(result.success).toBe(true)
        expect(result.result).toEqual(orders)
        expect(repository.execute).toHaveBeenCalledWith(input.status)
    })

    it("should return success false and CustomError when no orders found", async () => {
        repository.execute = vi.fn().mockResolvedValue([])
        useCase = new FindOrderByStatusUseCase(repository)
        const result = await useCase.execute(input)
        expect(result.success).toBe(false)
        expect(result.result).toEqual([])
        expect(result.error).toBeInstanceOf(CustomError)
        expect(result.error?.message).toBe("No orders found for this status.")
    })

    it("should return success false and CustomError on repository error", async () => {
        repository.execute = vi.fn().mockRejectedValue(new Error("fail"))
        useCase = new FindOrderByStatusUseCase(repository)
        const result = await useCase.execute(input)
        expect(result.success).toBe(false)
        expect(result.result).toEqual([])
        expect(result.error).toBeInstanceOf(CustomError)
        expect(result.error?.message).toBe("fail")
    })

    it("should call finish on repository when onFinish is called", async () => {
        await useCase.onFinish()
        expect(repository.finish).toHaveBeenCalled()
    })
})
