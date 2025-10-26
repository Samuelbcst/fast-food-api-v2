import { beforeEach, describe, expect, it, vi } from "vitest"
import * as factoryModule from "./make-order-item-get-by-id-dependencies"
import { getOrderItemById } from "./index"

vi.mock("./make-order-item-get-by-id-dependencies", () => ({
    makeGetOrderItemByIdFactory: vi.fn(),
}))

describe.skip("getOrderItemById", () => {
    const mockUseCase = {
        execute: vi.fn(),
        onFinish: vi.fn(),
        findOrderItemByIdRepository: {} as any,
    }
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(factoryModule.makeGetOrderItemByIdFactory).mockResolvedValue(
            mockUseCase as any
        )
        mockUseCase.execute.mockResolvedValue("result")
        mockUseCase.onFinish.mockResolvedValue(undefined)
    })

    it("calls use case and returns result", async () => {
        const params = { id: "123" }
        const result = await getOrderItemById(params)
        expect(factoryModule.makeGetOrderItemByIdFactory).toHaveBeenCalled()
        expect(mockUseCase.execute).toHaveBeenCalledWith({ id: 123 })
        expect(mockUseCase.onFinish).toHaveBeenCalled()
        expect(result).toBe("result")
    })

    it("throws if id is not a number", async () => {
        await expect(getOrderItemById({ id: "abc" })).rejects.toThrow(
            "Id must be a number"
        )
    })

    it("propagates errors from use case", async () => {
        mockUseCase.execute.mockRejectedValue(new Error("fail"))
        await expect(getOrderItemById({ id: "1" })).rejects.toThrow("fail")
    })
})

export {}
