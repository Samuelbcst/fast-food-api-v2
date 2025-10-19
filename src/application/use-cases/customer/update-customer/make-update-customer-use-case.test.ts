import { describe, expect, it } from "vitest"

import { UpdateCustomerUseCase } from "./index"
import { makeUpdateCustomerUseCase } from "./make-update-customer-use-case"

describe("makeUpdateCustomerUseCase", () => {
    it("should return an instance of UpdateCustomerUseCase with the provided repository", () => {
        const repository = {
            execute: async () => ({}) as any,
            finish: async () => {},
        }
        const useCase = makeUpdateCustomerUseCase(repository)
        expect(useCase).toBeInstanceOf(UpdateCustomerUseCase)
        expect(typeof useCase.execute).toBe("function")
        expect(typeof useCase.onFinish).toBe("function")
    })
})
