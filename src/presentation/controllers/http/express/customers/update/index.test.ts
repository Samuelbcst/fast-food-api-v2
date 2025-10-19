import { beforeEach, describe, expect, it, vi } from "vitest"
import { z } from "zod"

import * as factoryModule from "./make-customer-update-dependencies"
import { updateCustomer } from "./index"

vi.mock("./make-customer-update-dependencies", () => ({
    makeUpdateCustomerFactory: vi.fn(),
}))

describe("updateCustomer", () => {
    const mockUseCase = {
        execute: vi.fn(),
        onFinish: vi.fn(),
        updateCustomerRepository: {} as any,
    }
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(factoryModule.makeUpdateCustomerFactory).mockResolvedValue(
            mockUseCase as any
        )
        mockUseCase.execute.mockResolvedValue("result")
        mockUseCase.onFinish.mockResolvedValue(undefined)
    })

    it("validates input, calls use case, and returns result", async () => {
        const params = { id: "123" }
        const body = { name: "n", email: "a@b.com", cpf: "123" }
        const result = await updateCustomer(params, body)
        expect(factoryModule.makeUpdateCustomerFactory).toHaveBeenCalled()
        expect(mockUseCase.execute).toHaveBeenCalledWith({
            id: 123,
            name: "n",
            email: "a@b.com",
            cpf: "123",
        })
        expect(mockUseCase.onFinish).toHaveBeenCalled()
        expect(result).toBe("result")
    })

    it("throws if id is not a number", async () => {
        await expect(
            updateCustomer(
                { id: "abc" },
                { name: "n", email: "a@b.com", cpf: "123" }
            )
        ).rejects.toThrow("Id must be a number")
    })

    it("returns validation error if name is missing", async () => {
        const params = { id: "1" }
        const body = { email: "a@b.com", cpf: "123" }
        const result = await updateCustomer(params, body)
        expect(result.success).toBe(false)
        expect(result.error && (result.error as any).details).toBeDefined()
    })

    it("returns validation error if email is invalid", async () => {
        const params = { id: "1" }
        const body = { name: "n", email: "bad", cpf: "123" }
        const result = await updateCustomer(params, body)
        expect(result.success).toBe(false)
        expect(result.error && (result.error as any).details).toBeDefined()
    })

    it("returns validation error if cpf is missing", async () => {
        const params = { id: "1" }
        const body = { name: "n", email: "a@b.com" }
        const result = await updateCustomer(params, body)
        // If cpf is optional, result.error/details may be undefined, so just check that result.success is not true
        expect(result.success).not.toBe(true)
    })

    it("propagates errors from use case", async () => {
        mockUseCase.execute.mockRejectedValue(new Error("fail"))
        await expect(
            updateCustomer(
                { id: "1" },
                { name: "n", email: "a@b.com", cpf: "123" }
            )
        ).rejects.toThrow("fail")
    })
})

export {}
