import { beforeEach, describe, expect, it, vi } from "vitest"
import * as factory from "./make-order-get-all-dependencies"
import { getOrderAll } from "./index"

const mockUseCase = {
    execute: vi.fn(),
    onFinish: vi.fn(),
    repository: undefined, // satisfy type
} as any // cast to any to ignore private property

describe("getOrderAll", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(factory, "makeGetOrderAllFactory").mockResolvedValue(
            mockUseCase
        )
    })

    it("calls use case and returns result", async () => {
        mockUseCase.execute.mockResolvedValue(["order1", "order2"])
        const result = await getOrderAll()
        expect(factory.makeGetOrderAllFactory).toHaveBeenCalled()
        expect(mockUseCase.execute).toHaveBeenCalled()
        expect(mockUseCase.onFinish).toHaveBeenCalled()
        expect(result).toEqual(["order1", "order2"])
    })
})
export {}
