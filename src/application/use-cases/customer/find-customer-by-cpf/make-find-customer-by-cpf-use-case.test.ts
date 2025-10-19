import { describe, expect, it } from "vitest"

import { FindCustomerByCpfUseCase } from "./index"
import { makeFindCustomerByCpfUseCase } from "./make-find-customer-by-cpf-use-case"

describe("makeFindCustomerByCpfUseCase", () => {
    it("should return an instance of FindCustomerByCpfUseCase with the provided repository", () => {
        const repository = {
            execute: async () => ({}) as any,
            finish: async () => {},
        }
        const useCase = makeFindCustomerByCpfUseCase(repository)
        expect(useCase).toBeInstanceOf(FindCustomerByCpfUseCase)
        expect(typeof useCase.execute).toBe("function")
        expect(typeof useCase.onFinish).toBe("function")
    })
})
