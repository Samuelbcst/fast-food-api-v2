import { beforeEach, describe, expect, it, vi } from "vitest"
import * as factory from "./make-payment-get-all-dependencies"
import { getPaymentAll } from "./index"

const mockUseCase = {
    execute: vi.fn(),
    onFinish: vi.fn(),
} as any

describe.skip("getPaymentAll", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(factory, "makeGetPaymentAllFactory").mockResolvedValue(
            mockUseCase
        )
    })

    it("calls use case and returns result", async () => {
        mockUseCase.execute.mockResolvedValue(["payment1", "payment2"])
        const result = await getPaymentAll()
        expect(factory.makeGetPaymentAllFactory).toHaveBeenCalled()
        expect(mockUseCase.execute).toHaveBeenCalled()
        expect(mockUseCase.onFinish).toHaveBeenCalled()
        expect(result).toEqual(["payment1", "payment2"])
    })
})
export {}
