import { describe, it, expect, beforeEach } from "vitest"
import { DependencyContainer } from "./container"

/**
 * DI Container Tests
 *
 * These tests demonstrate how the DI container works
 * and verify that it properly manages dependencies.
 */
describe("DI Container - Learning Demo", () => {
    let container: DependencyContainer

    beforeEach(() => {
        // Reset container before each test for isolation
        DependencyContainer.reset()
        container = DependencyContainer.getInstance()
    })

    it("should be a singleton", () => {
        const container1 = DependencyContainer.getInstance()
        const container2 = DependencyContainer.getInstance()

        // Both should be the exact same instance
        expect(container1).toBe(container2)
    })

    it("should provide PrismaClient", () => {
        const prisma = container.prismaClient

        expect(prisma).toBeDefined()
        expect(prisma.$connect).toBeDefined()
    })

    it("should provide EventDispatcher singleton", () => {
        const dispatcher1 = container.eventDispatcher
        const dispatcher2 = container.eventDispatcher

        // Should be the same instance (singleton)
        expect(dispatcher1).toBe(dispatcher2)
    })

    it("should provide UUIDService singleton", () => {
        const uuid1 = container.uuidService
        const uuid2 = container.uuidService

        // Should be the same instance (singleton)
        expect(uuid1).toBe(uuid2)

        // Should generate valid UUIDs
        const id = uuid1.generate()
        expect(typeof id).toBe("number")
        expect(id).toBeGreaterThan(0)
    })

    it("should provide Category Repository", () => {
        const repo = container.categoryRepository

        expect(repo).toBeDefined()
        expect(repo.create).toBeDefined()
        expect(repo.finish).toBeDefined()
    })

    it("should provide Create Category Use Case", () => {
        const useCase = container.createCategoryUseCase

        expect(useCase).toBeDefined()
        expect(useCase.execute).toBeDefined()
        expect(useCase.onFinish).toBeDefined()
    })

    it("should provide Category Presenter singleton", () => {
        const presenter1 = container.categoryPresenter
        const presenter2 = container.categoryPresenter

        // Should be the same instance (singleton)
        expect(presenter1).toBe(presenter2)
        expect(presenter1.present).toBeDefined()
    })

    it("should wire up use case with all dependencies", () => {
        const useCase = container.createCategoryUseCase

        // The use case should be properly constructed
        // We can't directly test private properties, but we can test it works
        expect(useCase).toBeDefined()

        // The use case uses EventDispatcher, UUIDService, and Repository
        // These should all be available from the container
        expect(container.eventDispatcher).toBeDefined()
        expect(container.uuidService).toBeDefined()
        expect(container.categoryRepository).toBeDefined()
    })

    it("should demonstrate the power of DI", () => {
        // With DI container, getting a fully-wired use case is simple:
        const useCase = container.createCategoryUseCase

        // Behind the scenes, the container:
        // 1. Created EventDispatcher (singleton)
        // 2. Registered all event handlers
        // 3. Created UUIDService (singleton)
        // 4. Created CategoryRepository
        // 5. Wired everything together

        // All of this complexity is hidden from the controller!
        expect(useCase).toBeDefined()
    })
})
