import { describe, expect, it } from "vitest"

import { makeFindPaymentByIdUseCase } from "./make-find-payment-by-id-use-case"

describe("makeFindPaymentByIdUseCase", () => {
    it("should return an instance of FindPaymentByIdUseCase", () => {
        const mockRepo = { execute: () => {}, finish: () => {} }
        const useCase = makeFindPaymentByIdUseCase(mockRepo as any)
        expect(useCase).toBeDefined()
        expect(typeof useCase.execute).toBe("function")
        expect(typeof useCase.onFinish).toBe("function")
    })
})
