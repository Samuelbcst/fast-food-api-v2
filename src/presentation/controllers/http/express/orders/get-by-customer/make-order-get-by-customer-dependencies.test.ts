import * as repoModule from "@persistence/prisma/order/find-order-by-customer-repository/make-find-order-by-customer-repository"
import * as useCaseModule from "@application/use-cases/order/find-order-by-customer/make-find-order-by-customer-use-case"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { makeGetOrderByCustomerFactory } from "./make-order-get-by-customer-dependencies"

vi.mock(
    "@application/use-cases/order/find-order-by-customer/make-find-order-by-customer-use-case",
    () => ({
        makeFindOrderByCustomerUseCase: vi.fn(),
    })
)
vi.mock(
    "@persistence/prisma/order/find-order-by-customer-repository/make-find-order-by-customer-repository",
    () => ({
        makeFindOrderByCustomerOutputPort: vi.fn(),
    })
)

export {}

describe("makeGetOrderByCustomerFactory", () => {
    const mockRepository = { findByCustomer: vi.fn() }
    const mockUseCase = { execute: vi.fn(), onFinish: vi.fn() }
    let mockedMakeFindOrderByCustomerRepository: ReturnType<typeof vi.fn>
    let mockedMakeFindOrderByCustomerUseCase: ReturnType<typeof vi.fn>

    beforeEach(() => {
        mockedMakeFindOrderByCustomerRepository = vi.mocked(
            repoModule.makeFindOrderByCustomerOutputPort
        )
        mockedMakeFindOrderByCustomerUseCase = vi.mocked(
            useCaseModule.makeFindOrderByCustomerUseCase
        )
        if (mockedMakeFindOrderByCustomerRepository.mock)
            mockedMakeFindOrderByCustomerRepository.mockReset()
        if (mockedMakeFindOrderByCustomerUseCase.mock)
            mockedMakeFindOrderByCustomerUseCase.mockReset()
        if (mockedMakeFindOrderByCustomerRepository.mock)
            mockedMakeFindOrderByCustomerRepository.mockResolvedValue(
                mockRepository
            )
        if (mockedMakeFindOrderByCustomerUseCase.mock)
            mockedMakeFindOrderByCustomerUseCase.mockReturnValue(mockUseCase)
    })

    it("creates use case with repository and returns it", async () => {
        const result = await makeGetOrderByCustomerFactory()
        expect(repoModule.makeFindOrderByCustomerOutputPort).toHaveBeenCalled()
        expect(
            useCaseModule.makeFindOrderByCustomerUseCase
        ).toHaveBeenCalledWith(mockRepository)
        expect(result).toBe(mockUseCase)
    })

    it("propagates errors from repository", async () => {
        if (mockedMakeFindOrderByCustomerRepository.mock)
            mockedMakeFindOrderByCustomerRepository.mockRejectedValue(
                new Error("repo fail")
            )
        await expect(makeGetOrderByCustomerFactory()).rejects.toThrow(
            "repo fail"
        )
    })
})

export {}
