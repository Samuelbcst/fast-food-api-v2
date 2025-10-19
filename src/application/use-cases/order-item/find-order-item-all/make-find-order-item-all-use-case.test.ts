import { describe, expect, it } from "vitest"

import { FindOrderItemAllUseCase } from "./index"
import { makeFindOrderItemAllUseCase } from "./make-find-order-item-all-use-case"

describe("makeFindOrderItemAllUseCase", () => {
    it("should return an instance of FindOrderItemAllUseCase with the provided repository", () => {
        const repository = {
            execute: async () => [],
            finish: async () => {},
        }
        const useCase = makeFindOrderItemAllUseCase(repository)
        expect(useCase).toBeInstanceOf(FindOrderItemAllUseCase)
        expect(typeof useCase.execute).toBe("function")
        expect(typeof useCase.onFinish).toBe("function")
    })
})
