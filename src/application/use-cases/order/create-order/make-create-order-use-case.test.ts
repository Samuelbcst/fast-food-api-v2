import { describe, expect, it } from "vitest"

import { CreateOrderUseCase } from "./index"
import { makeCreateOrderUseCase } from "./make-create-order-use-case"

describe.skip("makeCreateOrderUseCase", () => {
    it("should return an instance of CreateOrderUseCase with the provided repository", () => {
        const repository = {
            create: async () => ({}) as any,
            finish: async () => {},
        }
        const productRepository = {
            execute: async () => ({}),
            finish: async () => {},
        }
        const useCase = makeCreateOrderUseCase(repository, productRepository)
        expect(useCase).toBeInstanceOf(CreateOrderUseCase)
        expect(typeof useCase.execute).toBe("function")
        expect(typeof useCase.onFinish).toBe("function")
    })
})
