import { beforeEach, describe, expect, it, vi } from "vitest"

import * as factoryModule from "./make-customer-create-dependencies"
import { createCustomer } from "./index"

vi.mock("./make-customer-create-dependencies", () => ({
    makeCreateCustomerFactory: vi.fn(),
}))

export {}

describe.skip("createCustomer", () => {
    const mockUseCase = {
        execute: vi.fn(),
        onFinish: vi.fn(),
        createCustomerRepository: {} as any,
    }
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(factoryModule.makeCreateCustomerFactory).mockResolvedValue(
            mockUseCase as any
        )
        mockUseCase.execute.mockResolvedValue("result")
        mockUseCase.onFinish.mockResolvedValue(undefined)
    })

    it("validates input, calls use case, and returns result", async () => {
        const body = { name: "n", email: "a@b.com", cpf: "123" }
        const result = await createCustomer({}, body)
        expect(factoryModule.makeCreateCustomerFactory).toHaveBeenCalled()
        expect(mockUseCase.execute).toHaveBeenCalledWith(body)
        expect(mockUseCase.onFinish).toHaveBeenCalled()
        expect(result).toBe("result")
    })

    it("returns validation error if input is invalid", async () => {
        const body = { name: "", email: "bad", cpf: "" }
        const result = await createCustomer({}, body)
        expect(result.success).toBe(false)
        expect(result.error).toBeDefined()
        expect((result.error as any)?.details).toBeDefined()
    })

    it("propagates non-validation errors", async () => {
        mockUseCase.execute.mockRejectedValue(new Error("fail"))
        const result = await createCustomer(
            {},
            { name: "n", email: "a@b.com", cpf: "123" }
        )
        expect(result.success).toBe(false)
        expect(result.result).toBeNull()
        expect(result.error).toBeDefined()
        if (result.error) {
            expect(result.error.message).toBe("fail")
            expect(result.error.code).toBe(500)
        }
    })
})

export {}
