import { describe, expect, it } from "vitest"

import { UpdateOrderStatusUseCase } from "./index"
import { makeUpdateOrderStatusUseCase } from "./make-update-order-status-use-case"

describe("makeUpdateOrderStatusUseCase", () => {
    it("should return an instance of UpdateOrderStatusUseCase with the provided repository", () => {
        const repository = {
            execute: async () => ({}) as any,
            finish: async () => {},
        }
        const useCase = makeUpdateOrderStatusUseCase(repository)
        expect(useCase).toBeInstanceOf(UpdateOrderStatusUseCase)
        expect(typeof useCase.execute).toBe("function")
        expect(typeof useCase.onFinish).toBe("function")
    })
})
