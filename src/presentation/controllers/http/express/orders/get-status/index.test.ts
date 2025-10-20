import { beforeEach, describe, expect, it, vi } from "vitest"

import * as factory from "../get-by-id/make-order-get-by-id-dependencies"
import { getOrderStatus } from "./index"

const mockUseCase = {
    execute: vi.fn(),
    onFinish: vi.fn(),
} as any

describe("getOrderStatus", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(factory, "makeGetOrderByIdFactory").mockResolvedValue(
            mockUseCase
        )
    })

    it("returns order status when found", async () => {
        mockUseCase.execute.mockResolvedValue({
            success: true,
            result: { status: "PREPARING" },
        })
        const result = await getOrderStatus({ id: "5" })
        expect(factory.makeGetOrderByIdFactory).toHaveBeenCalled()
        expect(mockUseCase.execute).toHaveBeenCalledWith({ id: 5 })
        expect(result.success).toBe(true)
        expect(result.result).toEqual({ status: "PREPARING" })
    })

    it("propagates not found error", async () => {
        mockUseCase.execute.mockResolvedValue({
            success: false,
            result: null,
            error: { message: "not found", code: 404 },
        })
        const result = await getOrderStatus({ id: "5" })
        expect(result.success).toBe(false)
        expect(result.error?.message).toBe("not found")
    })

    it("throws on invalid id", async () => {
        await expect(getOrderStatus({ id: "abc" })).rejects.toThrow(
            "id must be a number"
        )
        expect(factory.makeGetOrderByIdFactory).not.toHaveBeenCalled()
    })
})
