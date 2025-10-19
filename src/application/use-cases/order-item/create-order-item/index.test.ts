import { beforeEach, describe, expect, it, vi } from "vitest"

import { CreateOrderItemUseCase } from "./index"

const input = {
    orderId: 1,
    productId: 2,
    productName: "prod",
    unitPrice: 10,
    quantity: 2,
}
const orderItem = {
    id: 1,
    ...input,
    createdAt: new Date(),
    updatedAt: new Date(),
}

let repository: any
let useCase: CreateOrderItemUseCase

beforeEach(() => {
    repository = {
        create: vi.fn().mockResolvedValue(orderItem),
        finish: vi.fn().mockResolvedValue(undefined),
    }
    useCase = new CreateOrderItemUseCase(repository)
})

describe("CreateOrderItemUseCase", () => {
    it("should return success true when order item is created", async () => {
        const result = await useCase.execute(input)
        expect(result.success).toBe(true)
        expect(result.result).toEqual(orderItem)
        expect(repository.create).toHaveBeenCalledWith(input)
    })

    it("should return success false and error on failure", async () => {
        const errorMsg = "fail"
        repository.create = vi.fn().mockRejectedValue(new Error(errorMsg))
        useCase = new CreateOrderItemUseCase(repository)
        const result = await useCase.execute(input)
        expect(result.success).toBe(false)
        expect(result.result).toBeNull()
        expect(result.error).toBeDefined()
        // Optionally check error message:
        // expect(result.error?.message).toBe(errorMsg)
    })

    it("should call finish on repository when onFinish is called", async () => {
        await useCase.onFinish()
        expect(repository.finish).toHaveBeenCalled()
    })
})
