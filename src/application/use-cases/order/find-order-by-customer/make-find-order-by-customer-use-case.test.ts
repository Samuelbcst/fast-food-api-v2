import { describe, expect, it } from "vitest"

import { FindOrderByCustomerUseCase } from "./index"
import { makeFindOrderByCustomerUseCase } from "./make-find-order-by-customer-use-case"

describe("makeFindOrderByCustomerUseCase", () => {
    it("should return an instance of FindOrderByCustomerUseCase with the provided repository", () => {
        const repository = {
            execute: async () => [],
            finish: async () => {},
        }
        const useCase = makeFindOrderByCustomerUseCase(repository)
        expect(useCase).toBeInstanceOf(FindOrderByCustomerUseCase)
        expect(typeof useCase.execute).toBe("function")
        expect(typeof useCase.onFinish).toBe("function")
    })
})
