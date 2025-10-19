import { describe, expect, it } from "vitest"

import { DeleteOrderItemUseCase } from "./index"
import { makeDeleteOrderItemUseCase } from "./make-delete-order-item-use-case"

describe("makeDeleteOrderItemUseCase", () => {
    it("should return an instance of DeleteOrderItemUseCase with the provided repository", () => {
        const repository = {
            execute: async () => ({}) as any,
            finish: async () => {},
        }
        const useCase = makeDeleteOrderItemUseCase(repository)
        expect(useCase).toBeInstanceOf(DeleteOrderItemUseCase)
        expect(typeof useCase.execute).toBe("function")
        expect(typeof useCase.onFinish).toBe("function")
    })
})
