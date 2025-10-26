import { beforeEach, describe, expect, it, vi } from "vitest"
import * as factory from "./make-order-delete-dependencies"
import { deleteOrder } from "./index"

const mockUseCase = {
    execute: vi.fn(),
    onFinish: vi.fn(),
    deleteOrderRepository: undefined, // satisfy type
} as any // cast to any to ignore private property

describe.skip("deleteOrder", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(factory, "makeDeleteOrderFactory").mockResolvedValue(
            mockUseCase
        )
    })

    it("calls use case with correct id and returns result", async () => {
        mockUseCase.execute.mockResolvedValue("deleted!")
        const result = await deleteOrder({ id: "123" })
        expect(factory.makeDeleteOrderFactory).toHaveBeenCalled()
        expect(mockUseCase.execute).toHaveBeenCalledWith({ id: 123 })
        expect(mockUseCase.onFinish).toHaveBeenCalled()
        expect(result).toBe("deleted!")
    })

    it("throws if id is not a number", async () => {
        await expect(deleteOrder({ id: "abc" })).rejects.toThrow(
            "Id must be a number"
        )
        expect(factory.makeDeleteOrderFactory).not.toHaveBeenCalled()
    })
})
export {}
