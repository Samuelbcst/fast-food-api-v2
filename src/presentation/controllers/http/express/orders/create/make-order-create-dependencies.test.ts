import * as productRepoModule from "@persistence/prisma/product/find-product-by-id-repository/make-find-product-by-id-repository"
import * as repoModule from "@persistence/prisma/order/create-order-repository/make-create-order-repository"
import * as useCaseModule from "@use-cases/order/create-order/make-create-order-use-case"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { makeCreateOrderFactory } from "./make-order-create-dependencies"

vi.mock("@use-cases/order/create-order/make-create-order-use-case", () => ({
    makeCreateOrderUseCase: vi.fn(),
}))
vi.mock(
    "@persistence/prisma/order/create-order-repository/make-create-order-repository",
    () => ({
        makeCreateOrderRepository: vi.fn(),
    })
)
vi.mock(
    "@persistence/prisma/product/find-product-by-id-repository/make-find-product-by-id-repository",
    () => ({
        makeFindProductByIdRepository: vi.fn(),
    })
)

export {}

describe("makeCreateOrderFactory", () => {
    const mockRepository = { create: vi.fn(), finish: vi.fn() }
    const mockProductRepository = { execute: vi.fn(), finish: vi.fn() }
    const mockUseCase = { execute: vi.fn(), onFinish: vi.fn() }
    let mockedMakeCreateOrderRepository: ReturnType<typeof vi.fn>
    let mockedMakeFindProductByIdRepository: ReturnType<typeof vi.fn>
    let mockedMakeCreateOrderUseCase: ReturnType<typeof vi.fn>

    beforeEach(() => {
        mockedMakeCreateOrderRepository = vi.mocked(
            repoModule.makeCreateOrderRepository
        )
        mockedMakeFindProductByIdRepository = vi.mocked(
            productRepoModule.makeFindProductByIdRepository
        )
        mockedMakeCreateOrderUseCase = vi.mocked(
            useCaseModule.makeCreateOrderUseCase
        )
        if (mockedMakeCreateOrderRepository.mock)
            mockedMakeCreateOrderRepository.mockReset()
        if (mockedMakeFindProductByIdRepository.mock)
            mockedMakeFindProductByIdRepository.mockReset()
        if (mockedMakeCreateOrderUseCase.mock)
            mockedMakeCreateOrderUseCase.mockReset()
        if (mockedMakeCreateOrderRepository.mock)
            mockedMakeCreateOrderRepository.mockResolvedValue(mockRepository)
        if (mockedMakeFindProductByIdRepository.mock)
            mockedMakeFindProductByIdRepository.mockResolvedValue(
                mockProductRepository
            )
        if (mockedMakeCreateOrderUseCase.mock)
            mockedMakeCreateOrderUseCase.mockReturnValue(mockUseCase)
    })

    it("creates use case with repository and returns it", async () => {
        const result = await makeCreateOrderFactory()
        expect(repoModule.makeCreateOrderRepository).toHaveBeenCalled()
        expect(
            productRepoModule.makeFindProductByIdRepository
        ).toHaveBeenCalled()
        expect(useCaseModule.makeCreateOrderUseCase).toHaveBeenCalledWith(
            mockRepository,
            mockProductRepository
        )
        expect(result).toBe(mockUseCase)
    })

    it("propagates errors from repository", async () => {
        if (mockedMakeCreateOrderRepository.mock)
            mockedMakeCreateOrderRepository.mockRejectedValue(
                new Error("repo fail")
            )
        await expect(makeCreateOrderFactory()).rejects.toThrow("repo fail")
    })

    it("propagates errors from product repository", async () => {
        if (mockedMakeFindProductByIdRepository.mock)
            mockedMakeFindProductByIdRepository.mockRejectedValue(
                new Error("product repo fail")
            )
        await expect(makeCreateOrderFactory()).rejects.toThrow(
            "product repo fail"
        )
    })
})

export {}
