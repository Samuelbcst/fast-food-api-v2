import { beforeEach, describe, expect, it, vi } from "vitest"
import * as factory from "./make-order-update-status-dependencies"
import { OrderStatus } from "@entities/order/order"
import { updateOrderStatus } from "./index"

const mockUseCase = {
    execute: vi.fn(),
    onFinish: vi.fn(),
} as any

describe.skip("updateOrderStatus", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(factory, "makeUpdateOrderStatusFactory").mockResolvedValue(
            mockUseCase
        )
    })

    it("updates order status with valid input and returns result", async () => {
        mockUseCase.execute.mockResolvedValue("order-status-result")
        mockUseCase.onFinish.mockResolvedValue(undefined)
        const params = { id: "1" }
        const body = { status: OrderStatus.PREPARING }
        const result = await updateOrderStatus(params, body)
        expect(factory.makeUpdateOrderStatusFactory).toHaveBeenCalled()
        expect(mockUseCase.execute).toHaveBeenCalledWith({
            id: 1,
            status: OrderStatus.PREPARING,
        })
        expect(mockUseCase.onFinish).toHaveBeenCalled()
        expect(result).toBe("order-status-result")
    })

    it("throws if id is not a number", async () => {
        await expect(
            updateOrderStatus({ id: "abc" }, { status: OrderStatus.READY })
        ).rejects.toThrow("Id must be a number")
        expect(factory.makeUpdateOrderStatusFactory).not.toHaveBeenCalled()
    })

    it("throws if status is invalid", async () => {
        await expect(
            updateOrderStatus({ id: "1" }, { status: "INVALID" })
        ).rejects.toThrow()
        expect(factory.makeUpdateOrderStatusFactory).not.toHaveBeenCalled()
    })
})

export {}
