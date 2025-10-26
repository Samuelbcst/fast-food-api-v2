import { beforeEach, describe, expect, it, vi } from "vitest"
import * as factory from "./make-order-get-by-customer-dependencies"
import { getOrderByCustomer } from "./index"

const mockUseCase = {
    execute: vi.fn(),
    onFinish: vi.fn(),
    repository: undefined, // satisfy type
} as any // cast to any to ignore private property

describe.skip("getOrderByCustomer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(factory, "makeGetOrderByCustomerFactory").mockResolvedValue(
            mockUseCase
        )
    })

    it("calls use case with correct customerId and returns result", async () => {
        mockUseCase.execute.mockResolvedValue("orders!")
        const result = await getOrderByCustomer({ customerId: "42" })
        expect(factory.makeGetOrderByCustomerFactory).toHaveBeenCalled()
        expect(mockUseCase.execute).toHaveBeenCalledWith({ customerId: 42 })
        expect(mockUseCase.onFinish).toHaveBeenCalled()
        expect(result).toBe("orders!")
    })

    it("throws if customerId is not a number", async () => {
        await expect(getOrderByCustomer({ customerId: "abc" })).rejects.toThrow(
            "customerId must be a number"
        )
        expect(factory.makeGetOrderByCustomerFactory).not.toHaveBeenCalled()
    })
})
export {}
