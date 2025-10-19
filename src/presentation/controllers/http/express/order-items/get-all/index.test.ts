import { beforeEach, describe, expect, it, vi } from "vitest"
import * as factoryModule from "./make-order-item-get-all-dependencies"
import { getOrderItemAll } from "./index"

vi.mock("./make-order-item-get-all-dependencies", () => ({
    makeGetOrderItemAllFactory: vi.fn(),
}))

describe("getOrderItemAll", () => {
    const mockUseCase = {
        execute: vi.fn(),
        onFinish: vi.fn(),
        findOrderItemAllRepository: {} as any,
    }
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(factoryModule.makeGetOrderItemAllFactory).mockResolvedValue(
            mockUseCase as any
        )
        mockUseCase.execute.mockResolvedValue("result")
        mockUseCase.onFinish.mockResolvedValue(undefined)
    })

    it("calls use case and returns result", async () => {
        const result = await getOrderItemAll()
        expect(factoryModule.makeGetOrderItemAllFactory).toHaveBeenCalled()
        expect(mockUseCase.execute).toHaveBeenCalled()
        expect(mockUseCase.onFinish).toHaveBeenCalled()
        expect(result).toBe("result")
    })

    it("propagates errors from use case", async () => {
        mockUseCase.execute.mockRejectedValue(new Error("fail"))
        await expect(getOrderItemAll()).rejects.toThrow("fail")
    })
})

export {}
