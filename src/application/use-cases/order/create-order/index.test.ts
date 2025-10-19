import { OrderStatus } from "@entities/order/order"
import type { CreateOrderRepository } from "@src/application/repositories/order/create-order"
import { CustomError } from "@use-cases/custom-error"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { CreateOrderUseCase } from "."

describe("CreateOrderUseCase", () => {
    let repository: CreateOrderRepository
    let useCase: CreateOrderUseCase
    const input = {
        customerId: 1,
        items: [],
        status: OrderStatus.RECEIVED,
        statusUpdatedAt: new Date(),
        totalAmount: 100,
    }
    const order = {
        id: 1,
        ...input,
        createdAt: new Date(),
        updatedAt: new Date(),
    }

    beforeEach(() => {
        repository = {
            create: vi.fn().mockResolvedValue(order),
            finish: vi.fn().mockResolvedValue(undefined),
        }
        useCase = new CreateOrderUseCase(repository)
    })

    it("should return success true and the created order", async () => {
        const result = await useCase.execute(input)
        expect(result.success).toBe(true)
        expect(result.result).toEqual(order)
        expect(repository.create).toHaveBeenCalledWith(input)
    })

    it("should return success false and CustomError on repository error", async () => {
        const errorMsg = "fail"
        repository.create = vi.fn().mockRejectedValue(new Error(errorMsg))
        useCase = new CreateOrderUseCase(repository)
        const result = await useCase.execute(input)
        expect(result.success).toBe(false)
        expect(result.result).toBeNull()
        expect(result.error).toBeInstanceOf(CustomError)
        expect(result.error?.message).toBe(errorMsg)
    })

    it("should call finish on repository when onFinish is called", async () => {
        await useCase.onFinish()
        expect(repository.finish).toHaveBeenCalled()
    })
})
