import { beforeEach, describe, expect, it, vi } from "vitest"

import * as factoryModule from "./make-customer-get-by-cpf-dependencies"
import { getCustomerByCpf } from "./index"

vi.mock("./make-customer-get-by-cpf-dependencies", () => ({
    makeGetCustomerByCpfFactory: vi.fn(),
}))

describe("getCustomerByCpf", () => {
    const mockUseCase = {
        execute: vi.fn(),
        onFinish: vi.fn(),
        findCustomerByCpfRepository: {} as any,
    }
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(factoryModule.makeGetCustomerByCpfFactory).mockResolvedValue(
            mockUseCase as any
        )
        mockUseCase.execute.mockResolvedValue("result")
        mockUseCase.onFinish.mockResolvedValue(undefined)
    })

    it("calls use case and returns result", async () => {
        const params = { cpf: "123" }
        const result = await getCustomerByCpf(params)
        expect(factoryModule.makeGetCustomerByCpfFactory).toHaveBeenCalled()
        expect(mockUseCase.execute).toHaveBeenCalledWith({ cpf: "123" })
        expect(mockUseCase.onFinish).toHaveBeenCalled()
        expect(result).toBe("result")
    })

    it("throws if cpf is missing", async () => {
        await expect(getCustomerByCpf({})).rejects.toThrow("CPF is required")
    })

    it("propagates errors from use case", async () => {
        mockUseCase.execute.mockRejectedValue(new Error("fail"))
        await expect(getCustomerByCpf({ cpf: "1" })).rejects.toThrow("fail")
    })
})

export {}
