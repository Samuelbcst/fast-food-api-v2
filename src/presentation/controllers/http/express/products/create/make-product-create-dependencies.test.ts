import * as repoModule from "@persistence/prisma/product/create-product-repository/make-create-product-repository"
import * as useCaseModule from "@application/use-cases/product/create-product/make-create-product-use-case"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { makeCreateProductFactory } from "./make-product-create-dependencies"

vi.mock(
    "@application/use-cases/product/create-product/make-create-product-use-case",
    () => ({
        makeCreateProductUseCase: vi.fn(),
    })
)
vi.mock(
    "@persistence/prisma/product/create-product-repository/make-create-product-repository",
    () => ({
        makeCreateProductOutputPort: vi.fn(),
    })
)

describe("makeCreateProductFactory", () => {
    const mockRepository = { create: vi.fn() }
    const mockUseCase = { execute: vi.fn(), onFinish: vi.fn() }
    let mockedMakeCreateProductRepository: ReturnType<typeof vi.fn>
    let mockedMakeCreateProductUseCase: ReturnType<typeof vi.fn>

    beforeEach(() => {
        mockedMakeCreateProductRepository = vi.mocked(
            repoModule.makeCreateProductOutputPort
        )
        mockedMakeCreateProductUseCase = vi.mocked(
            useCaseModule.makeCreateProductUseCase
        )
        if (mockedMakeCreateProductRepository.mock)
            mockedMakeCreateProductRepository.mockReset()
        if (mockedMakeCreateProductUseCase.mock)
            mockedMakeCreateProductUseCase.mockReset()
        if (mockedMakeCreateProductRepository.mock)
            mockedMakeCreateProductRepository.mockResolvedValue(mockRepository)
        if (mockedMakeCreateProductUseCase.mock)
            mockedMakeCreateProductUseCase.mockReturnValue(mockUseCase)
    })

    it("creates use case with repository and returns it", async () => {
        const result = await makeCreateProductFactory()
        expect(repoModule.makeCreateProductOutputPort).toHaveBeenCalled()
        expect(useCaseModule.makeCreateProductUseCase).toHaveBeenCalledWith(
            mockRepository
        )
        expect(result).toBe(mockUseCase)
    })

    it("propagates errors from repository", async () => {
        if (mockedMakeCreateProductRepository.mock)
            mockedMakeCreateProductRepository.mockRejectedValue(
                new Error("repo fail")
            )
        await expect(makeCreateProductFactory()).rejects.toThrow("repo fail")
    })
})
export {}
