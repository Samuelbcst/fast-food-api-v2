import { beforeEach, describe, expect, it, vi } from "vitest"

import * as factoryModule from "./make-customer-get-all-dependencies"
import { getCustomerAll } from "./index"

vi.mock("./make-customer-get-all-dependencies", () => ({
    makeGetCustomerAllFactory: vi.fn(),
}))

describe("getCustomerAll", () => {
    const mockUseCase = {
        execute: vi.fn(),
        onFinish: vi.fn(),
        findCustomerAllRepository: {} as any,
    }
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(factoryModule.makeGetCustomerAllFactory).mockResolvedValue(
            mockUseCase as any
        )
        mockUseCase.execute.mockResolvedValue("result")
        mockUseCase.onFinish.mockResolvedValue(undefined)
    })

    it("calls use case and returns result", async () => {
        const result = await getCustomerAll()
        expect(factoryModule.makeGetCustomerAllFactory).toHaveBeenCalled()
        expect(mockUseCase.execute).toHaveBeenCalled()
        expect(mockUseCase.onFinish).toHaveBeenCalled()
        expect(result).toBe("result")
    })

    it("propagates errors from use case", async () => {
        mockUseCase.execute.mockRejectedValue(new Error("fail"))
        await expect(getCustomerAll()).rejects.toThrow("fail")
    })
})

export {}
