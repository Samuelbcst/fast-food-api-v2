import type { FindOrderItemAllOutputPort } from "@application/ports/output/order-item/find-order-item-all-output-port"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { FindOrderItemAllUseCase } from "."

describe("FindOrderItemAllUseCase", () => {
    let repository: FindOrderItemAllOutputPort
    let useCase: FindOrderItemAllUseCase
    const orderItems = [
        {
            id: 1,
            orderId: 1,
            productId: 2,
            productName: "prod",
            unitPrice: 10,
            quantity: 2,
        },
        {
            id: 2,
            orderId: 1,
            productId: 3,
            productName: "prod2",
            unitPrice: 20,
            quantity: 1,
        },
    ]

    beforeEach(() => {
        repository = {
            execute: vi.fn().mockResolvedValue(orderItems),
            finish: vi.fn().mockResolvedValue(undefined),
        }
        useCase = new FindOrderItemAllUseCase(repository)
    })

    it("should return success true and all order items", async () => {
        const result = await useCase.execute()
        expect(result.success).toBe(true)
        expect(result.result).toEqual(orderItems)
        expect(repository.execute).toHaveBeenCalled()
    })

    it("should return success false and empty array on repository error", async () => {
        repository.execute = vi.fn().mockRejectedValue(new Error("fail"))
        useCase = new FindOrderItemAllUseCase(repository)
        const result = await useCase.execute()
        expect(result.success).toBe(false)
        expect(result.result).toEqual([])
    })

    it("should call finish on repository when onFinish is called", async () => {
        await useCase.onFinish()
        expect(repository.finish).toHaveBeenCalled()
    })
})
