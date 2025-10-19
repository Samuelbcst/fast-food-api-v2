import { describe, expect, it } from "vitest"

import { FindCustomerAllUseCase } from "./index"
import { makeFindCustomerAllUseCase } from "./make-find-customer-all-use-case"

describe("makeFindCustomerAllUseCase", () => {
    it("should return an instance of FindCustomerAllUseCase with the provided repository", () => {
        const repository = {
            execute: async () => [],
            finish: async () => {},
        }
        const useCase = makeFindCustomerAllUseCase(repository)
        expect(useCase).toBeInstanceOf(FindCustomerAllUseCase)
        expect(typeof useCase.execute).toBe("function")
        expect(typeof useCase.onFinish).toBe("function")
    })
})
