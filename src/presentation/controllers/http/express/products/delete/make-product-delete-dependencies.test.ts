import * as repoModule from "@persistence/prisma/product/delete-product-repository/make-delete-product-repository"
import * as useCaseModule from "@use-cases/product/delete-product/make-delete-product-use-case"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { makeDeleteProductFactory } from "./make-product-delete-dependencies"

vi.mock(
    "@use-cases/product/delete-product/make-delete-product-use-case",
    () => ({
        makeDeleteProductUseCase: vi.fn(),
    })
)
vi.mock(
    "@persistence/prisma/product/delete-product-repository/make-delete-product-repository",
    () => ({
        makeDeleteProductRepository: vi.fn(),
    })
)

describe("makeDeleteProductFactory", () => {
    const mockRepository = { delete: vi.fn() }
    const mockUseCase = { execute: vi.fn(), onFinish: vi.fn() }
    let mockedMakeDeleteProductRepository: ReturnType<typeof vi.fn>
    let mockedMakeDeleteProductUseCase: ReturnType<typeof vi.fn>

    beforeEach(() => {
        mockedMakeDeleteProductRepository = vi.mocked(
            repoModule.makeDeleteProductRepository
        )
        mockedMakeDeleteProductUseCase = vi.mocked(
            useCaseModule.makeDeleteProductUseCase
        )
        if (mockedMakeDeleteProductRepository.mock)
            mockedMakeDeleteProductRepository.mockReset()
        if (mockedMakeDeleteProductUseCase.mock)
            mockedMakeDeleteProductUseCase.mockReset()
        if (mockedMakeDeleteProductRepository.mock)
            mockedMakeDeleteProductRepository.mockResolvedValue(mockRepository)
        if (mockedMakeDeleteProductUseCase.mock)
            mockedMakeDeleteProductUseCase.mockReturnValue(mockUseCase)
    })

    it("creates use case with repository and returns it", async () => {
        const result = await makeDeleteProductFactory()
        expect(repoModule.makeDeleteProductRepository).toHaveBeenCalled()
        expect(useCaseModule.makeDeleteProductUseCase).toHaveBeenCalledWith(
            mockRepository
        )
        expect(result).toBe(mockUseCase)
    })

    it("propagates errors from repository", async () => {
        if (mockedMakeDeleteProductRepository.mock)
            mockedMakeDeleteProductRepository.mockRejectedValue(
                new Error("repo fail")
            )
        await expect(makeDeleteProductFactory()).rejects.toThrow("repo fail")
    })
})
export {}
