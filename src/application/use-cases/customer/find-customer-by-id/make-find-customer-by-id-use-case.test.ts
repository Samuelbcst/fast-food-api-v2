import { describe, expect, it } from "vitest"

import { FindCustomerByIdUseCase } from "./index"
import { makeFindCustomerByIdUseCase } from "./make-find-customer-by-id-use-case"

describe("makeFindCustomerByIdUseCase", () => {
    it("should return an instance of FindCustomerByIdUseCase with the provided repository", () => {
        const repository = {
            execute: async () => ({}) as any,
            finish: async () => {},
        }
        const useCase = makeFindCustomerByIdUseCase(repository)
        expect(useCase).toBeInstanceOf(FindCustomerByIdUseCase)
        expect(typeof useCase.execute).toBe("function")
        expect(typeof useCase.onFinish).toBe("function")
    })
})
