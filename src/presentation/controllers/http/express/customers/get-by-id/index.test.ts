import { beforeEach, describe, expect, it, vi } from "vitest"

import * as factoryModule from "./make-customer-get-by-id-dependencies"
import { getCustomerById } from "./index"

vi.mock("./make-customer-get-by-id-dependencies", () => ({
    makeGetCustomerByIdFactory: vi.fn(),
}))

describe.skip("getCustomerById", () => {
    const mockUseCase = {
        execute: vi.fn(),
        onFinish: vi.fn(),
        findCustomerByIdRepository: {} as any,
    }
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(factoryModule.makeGetCustomerByIdFactory).mockResolvedValue(
            mockUseCase as any
        )
        mockUseCase.execute.mockResolvedValue("result")
        mockUseCase.onFinish.mockResolvedValue(undefined)
    })

    it("calls use case and returns result", async () => {
        const params = { id: "123" }
        const result = await getCustomerById(params)
        expect(factoryModule.makeGetCustomerByIdFactory).toHaveBeenCalled()
        expect(mockUseCase.execute).toHaveBeenCalledWith({ id: 123 })
        expect(mockUseCase.onFinish).toHaveBeenCalled()
        expect(result).toBe("result")
    })

    it("throws if id is not a number", async () => {
        await expect(getCustomerById({ id: "abc" })).rejects.toThrow(
            "Id must be a number"
        )
    })

    it("propagates errors from use case", async () => {
        mockUseCase.execute.mockRejectedValue(new Error("fail"))
        await expect(getCustomerById({ id: "1" })).rejects.toThrow("fail")
    })
})

export {}
