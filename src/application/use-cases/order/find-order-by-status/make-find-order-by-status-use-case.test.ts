import { describe, expect, it } from "vitest"

import { FindOrderByStatusUseCase } from "./index"
import { makeFindOrderByStatusUseCase } from "./make-find-order-by-status-use-case"

describe("makeFindOrderByStatusUseCase", () => {
    it("should return an instance of FindOrderByStatusUseCase with the provided repository", () => {
        const repository = {
            execute: async () => [],
            finish: async () => {},
        }
        const useCase = makeFindOrderByStatusUseCase(repository)
        expect(useCase).toBeInstanceOf(FindOrderByStatusUseCase)
        expect(typeof useCase.execute).toBe("function")
        expect(typeof useCase.onFinish).toBe("function")
    })
})
