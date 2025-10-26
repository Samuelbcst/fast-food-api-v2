import { describe, expect, it } from "vitest"

import { UpdateOrderUseCase } from "./index"
import { makeUpdateOrderUseCase } from "./make-update-order-use-case"

describe.skip("makeUpdateOrderUseCase", () => {
    it("should return an instance of UpdateOrderUseCase with the provided repository", () => {
        const repository = {
            execute: async () => ({}) as any,
            finish: async () => {},
        }
        const useCase = makeUpdateOrderUseCase(repository)
        expect(useCase).toBeInstanceOf(UpdateOrderUseCase)
        expect(typeof useCase.execute).toBe("function")
        expect(typeof useCase.onFinish).toBe("function")
    })
})
