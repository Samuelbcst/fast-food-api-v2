import { describe, expect, it } from "vitest"

import { UpdateOrderStatusUseCase } from "./index"
import { makeUpdateOrderStatusUseCase } from "./make-update-order-status-use-case"

describe("makeUpdateOrderStatusUseCase", () => {
    it("should return an instance of UpdateOrderStatusUseCase with the provided repository", () => {
        const repository = {
            execute: async () => ({}) as any,
            finish: async () => {},
        }
        const findOrderRepo = {
            execute: async () => ({}),
            finish: async () => {},
        }
        const findPaymentRepo = {
            execute: async () => ({}),
            finish: async () => {},
        }
        const useCase = makeUpdateOrderStatusUseCase(
            repository,
            findOrderRepo as any,
            findPaymentRepo as any
        )
        expect(useCase).toBeInstanceOf(UpdateOrderStatusUseCase)
        expect(typeof useCase.execute).toBe("function")
        expect(typeof useCase.onFinish).toBe("function")
    })
})
