import { beforeEach, describe, expect, it, vi } from "vitest"

import * as factoryModule from "./make-customer-delete-dependencies"
import { deleteCustomer } from "./index"

vi.mock("./make-customer-delete-dependencies", () => ({
    makeDeleteCustomerFactory: vi.fn(),
}))

describe("deleteCustomer", () => {
    const mockUseCase = {
        execute: vi.fn(),
        onFinish: vi.fn(),
        deleteCustomerRepository: {} as any,
    }
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(factoryModule.makeDeleteCustomerFactory).mockResolvedValue(
            mockUseCase as any
        )
        mockUseCase.execute.mockResolvedValue("result")
        mockUseCase.onFinish.mockResolvedValue(undefined)
    })

    it("calls use case and returns result", async () => {
        const params = { id: "123" }
        const result = await deleteCustomer(params)
        expect(factoryModule.makeDeleteCustomerFactory).toHaveBeenCalled()
        expect(mockUseCase.execute).toHaveBeenCalledWith({ id: 123 })
        expect(mockUseCase.onFinish).toHaveBeenCalled()
        expect(result).toBe("result")
    })

    it("throws if id is not a number", async () => {
        await expect(deleteCustomer({ id: "abc" })).rejects.toThrow(
            "Id must be a number"
        )
    })

    it("propagates errors from use case", async () => {
        mockUseCase.execute.mockRejectedValue(new Error("fail"))
        await expect(deleteCustomer({ id: "1" })).rejects.toThrow("fail")
    })
})

export {}
