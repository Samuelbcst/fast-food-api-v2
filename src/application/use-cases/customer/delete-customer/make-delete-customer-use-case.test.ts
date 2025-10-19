import { describe, expect, it } from "vitest"

import { DeleteCustomerUseCase } from "./index"
import { makeDeleteCustomerUseCase } from "./make-delete-customer-use-case"

describe("makeDeleteCustomerUseCase", () => {
    it("should return an instance of DeleteCustomerUseCase with the provided repository", () => {
        const repository = {
            execute: async () => ({}) as any,
            finish: async () => {},
        }
        const useCase = makeDeleteCustomerUseCase(repository)
        expect(useCase).toBeInstanceOf(DeleteCustomerUseCase)
        expect(typeof useCase.execute).toBe("function")
        expect(typeof useCase.onFinish).toBe("function")
    })
})
