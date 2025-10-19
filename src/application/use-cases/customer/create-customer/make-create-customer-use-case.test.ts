import { describe, expect, it } from "vitest"

import { CreateCustomerUseCase } from "./index"
import { makeCreateCustomerUseCase } from "./make-create-customer-use-case"

describe("makeCreateCustomerUseCase", () => {
    it("should return an instance of CreateCustomerUseCase with the provided repository", () => {
        const repository = {
            create: async () => ({}) as any,
            finish: async () => {},
        }
        const useCase = makeCreateCustomerUseCase(repository)
        expect(useCase).toBeInstanceOf(CreateCustomerUseCase)
        expect(typeof useCase.execute).toBe("function")
        expect(typeof useCase.onFinish).toBe("function")
    })
})
