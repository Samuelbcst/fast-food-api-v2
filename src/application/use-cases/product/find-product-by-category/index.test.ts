import { CustomError } from "@use-cases/custom-error"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { FindProductByCategoryUseCase } from "./index"

describe("FindProductByCategoryUseCase", () => {
    let findProductByCategoryRepository: any
    let useCase: FindProductByCategoryUseCase
    const mockProducts = [
        {
            id: 1,
            name: "prod",
            price: 1,
            categoryId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 2,
            name: "prod2",
            price: 2,
            categoryId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ]

    beforeEach(() => {
        findProductByCategoryRepository = {
            execute: vi.fn(),
            finish: vi.fn().mockResolvedValue(undefined),
        }
        useCase = new FindProductByCategoryUseCase(
            findProductByCategoryRepository
        )
    })

    it("should return products if found", async () => {
        findProductByCategoryRepository.execute.mockResolvedValue(mockProducts)
        const result = await useCase.execute({ categoryId: 1 })
        expect(findProductByCategoryRepository.execute).toHaveBeenCalledWith(1)
        expect(result.success).toBe(true)
        expect(result.result).toEqual(mockProducts)
    })

    it("should return error if no products found (empty array)", async () => {
        findProductByCategoryRepository.execute.mockResolvedValue([])
        const result = await useCase.execute({ categoryId: 2 })
        expect(result.success).toBe(false)
        expect(result.result).toEqual([])
        expect(result.error).toBeInstanceOf(CustomError)
        expect(result.error?.message).toBe(
            "No products found for this category."
        )
        expect(result.error?.code).toBe(404)
    })

    it("should return error if no products found (null)", async () => {
        findProductByCategoryRepository.execute.mockResolvedValue(null)
        const result = await useCase.execute({ categoryId: 3 })
        expect(result.success).toBe(false)
        expect(result.result).toEqual([])
        expect(result.error).toBeInstanceOf(CustomError)
        expect(result.error?.message).toBe(
            "No products found for this category."
        )
        expect(result.error?.code).toBe(404)
    })

    it("should return error if repository throws", async () => {
        findProductByCategoryRepository.execute.mockRejectedValue(
            new Error("fail")
        )
        const result = await useCase.execute({ categoryId: 4 })
        expect(result.success).toBe(false)
        expect(result.result).toEqual([])
        expect(result.error).toBeInstanceOf(CustomError)
        expect(result.error?.message).toBe("fail")
        expect(result.error?.code).toBe(400)
    })

    it("should call finish on onFinish", async () => {
        await useCase.onFinish()
        expect(findProductByCategoryRepository.finish).toHaveBeenCalled()
    })
})
