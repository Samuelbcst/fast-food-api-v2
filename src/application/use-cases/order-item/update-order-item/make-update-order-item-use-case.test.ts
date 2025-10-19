import { describe, expect, it } from "vitest"

import { UpdateOrderItemUseCase } from "./index"
import { makeUpdateOrderItemUseCase } from "./make-update-order-item-use-case"

describe("makeUpdateOrderItemUseCase", () => {
    it("should return an instance of UpdateOrderItemUseCase with the provided repository", () => {
        const repository = {
            execute: async () => ({}) as any,
            finish: async () => {},
        }
        const useCase = makeUpdateOrderItemUseCase(repository)
        expect(useCase).toBeInstanceOf(UpdateOrderItemUseCase)
        expect(typeof useCase.execute).toBe("function")
        expect(typeof useCase.onFinish).toBe("function")
    })
})
