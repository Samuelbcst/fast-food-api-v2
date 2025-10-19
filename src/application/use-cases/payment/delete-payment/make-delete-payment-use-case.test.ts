import { describe, expect, it } from "vitest"

import { makeDeletePaymentUseCase } from "./make-delete-payment-use-case"

describe("makeDeletePaymentUseCase", () => {
    it("should return an instance of DeletePaymentUseCase", () => {
        const mockRepo = { execute: () => {}, finish: () => {} }
        const useCase = makeDeletePaymentUseCase(mockRepo as any)
        expect(useCase).toBeDefined()
        expect(typeof useCase.execute).toBe("function")
        expect(typeof useCase.onFinish).toBe("function")
    })
})
