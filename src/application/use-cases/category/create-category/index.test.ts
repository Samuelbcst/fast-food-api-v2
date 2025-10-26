import { beforeEach, describe, expect, it, vi } from "vitest"
import { Category } from "@entities/category/category"
import { CreateCategoryUseCase } from "./index"

const input = { name: "cat", description: "desc" }

let repository: any
let uuidService: any
let eventDispatcher: any
let useCase: CreateCategoryUseCase

beforeEach(() => {
    // Mock category that will be returned from repository
    const mockCategory = new Category("test-uuid", input.name, input.description, false)

    // Mock repository
    repository = {
        create: vi.fn().mockResolvedValue(mockCategory),
        finish: vi.fn().mockResolvedValue(undefined),
    }

    // Mock UUID service
    uuidService = {
        generate: vi.fn().mockReturnValue("test-uuid"),
    }

    // Mock event dispatcher
    eventDispatcher = {
        dispatch: vi.fn().mockResolvedValue(undefined),
        dispatchAll: vi.fn().mockResolvedValue(undefined),
    }

    useCase = new CreateCategoryUseCase(repository, uuidService, eventDispatcher)
})

describe.skip("CreateCategoryUseCase", () => {
    it("should return success true when category is created", async () => {
        const result = await useCase.execute(input)
        expect(result.success).toBe(true)
        expect(result.result).toBeInstanceOf(Category)
        expect(result.result?.name).toBe(input.name)
        expect(result.result?.description).toBe(input.description)
        expect(uuidService.generate).toHaveBeenCalled()
        expect(repository.create).toHaveBeenCalled()
        expect(eventDispatcher.dispatchAll).toHaveBeenCalled()
    })

    it("should return success false and error on failure", async () => {
        const errorMsg = "fail"
        repository.create = vi.fn().mockRejectedValue(new Error(errorMsg))
        useCase = new CreateCategoryUseCase(repository, uuidService, eventDispatcher)
        const result = await useCase.execute(input)
        expect(result.success).toBe(false)
        expect(result.result).toBeNull()
        expect(result.error).toBeDefined()
    })

    it("should call finish on repository when onFinish is called", async () => {
        await useCase.onFinish()
        expect(repository.finish).toHaveBeenCalled()
    })

    it("should dispatch domain events after creating category", async () => {
        const result = await useCase.execute(input)
        expect(result.success).toBe(true)
        // Events should have been dispatched
        expect(eventDispatcher.dispatchAll).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({
                    eventType: "CategoryCreated",
                })
            ])
        )
        // Events should be cleared after dispatching
        expect(result.result?.getDomainEvents()).toHaveLength(0)
    })
})
