import { beforeEach, describe, expect, it, vi } from "vitest"
import * as factoryModule from "./make-order-item-delete-dependencies"
import { deleteOrderItem } from "./index"

vi.mock("./make-order-item-delete-dependencies", () => ({
    makeDeleteOrderItemFactory: vi.fn(),
}))

describe.skip("deleteOrderItem", () => {
    const mockUseCase = {
        execute: vi.fn(),
        onFinish: vi.fn(),
        deleteOrderItemRepository: {} as any,
    }
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(factoryModule.makeDeleteOrderItemFactory).mockResolvedValue(
            mockUseCase as any
        )
        mockUseCase.execute.mockResolvedValue("result")
        mockUseCase.onFinish.mockResolvedValue(undefined)
    })

    it("calls use case and returns result", async () => {
        const params = { id: "123" }
        const result = await deleteOrderItem(params)
        expect(factoryModule.makeDeleteOrderItemFactory).toHaveBeenCalled()
        expect(mockUseCase.execute).toHaveBeenCalledWith({ id: 123 })
        expect(mockUseCase.onFinish).toHaveBeenCalled()
        expect(result).toBe("result")
    })

    it("throws if id is not a number", async () => {
        await expect(deleteOrderItem({ id: "abc" })).rejects.toThrow(
            "Id must be a number"
        )
    })

    it("propagates errors from use case", async () => {
        mockUseCase.execute.mockRejectedValue(new Error("fail"))
        await expect(deleteOrderItem({ id: "1" })).rejects.toThrow("fail")
    })
})

export {}
