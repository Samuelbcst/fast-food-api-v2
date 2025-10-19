import { describe, expect, it } from "vitest"

import { makeCreatePaymentUseCase } from "./make-create-payment-use-case"

describe("makeCreatePaymentUseCase", () => {
    it("should return an instance of CreatePaymentUseCase", () => {
        const mockPaymentRepo = { create: () => {}, finish: () => {} }
        const mockOrderRepo = { execute: () => {}, finish: () => {} }
        const useCase = makeCreatePaymentUseCase(
            mockPaymentRepo as any,
            mockOrderRepo as any
        )
        expect(useCase).toBeDefined()
        expect(typeof useCase.execute).toBe("function")
        expect(typeof useCase.onFinish).toBe("function")
    })
})
