import { describe, expect, it } from "vitest"

import { CreateOrderItemUseCase } from "./index"
import { makeCreateOrderItemUseCase } from "./make-create-order-item-use-case"

describe("makeCreateOrderItemUseCase", () => {
    it("should return an instance of CreateOrderItemUseCase with the provided repository", () => {
        const repository = {
            create: async () => ({}) as any,
            finish: async () => {},
        }
        const useCase = makeCreateOrderItemUseCase(repository)
        expect(useCase).toBeInstanceOf(CreateOrderItemUseCase)
        expect(typeof useCase.execute).toBe("function")
        expect(typeof useCase.onFinish).toBe("function")
    })
})
