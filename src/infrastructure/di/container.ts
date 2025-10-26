import { PrismaClient } from "@prisma/client"
import { CategoryCreatedHandler } from "../../application/event-handlers/category-created-handler"
import { CreateCategoryInputPort } from "../../application/ports/input/category/create-category-input"
import { CreateCategoryOutputPort } from "../../application/ports/output/category/create-category-output-port"
import { CreateCategoryUseCase } from "../../application/use-cases/category/create-category"
import { EventDispatcher } from "../../domain/events/event-dispatcher"
import { UUIDService } from "../../domain/services/UUIDService"
import { prisma } from "../libraries/prisma/client"
import { PrismaCreateCategoryRepository } from "../persistence/prisma/category/create-category-repository/create-category-repository"
import { CategoryPresenter } from "../../presentation/presenters/category-presenter"
import { UuidServiceImpl } from "../services/UuidServicesImpl"
import { InMemoryEventDispatcher } from "../events/in-memory-event-dispatcher"

/**
 * Dependency Injection Container
 *
 * This is the heart of our dependency management system.
 * It follows the Singleton pattern and provides lazy initialization.
 *
 * Benefits:
 * 1. Single source of truth for all dependencies
 * 2. Easy to swap implementations (for testing or different environments)
 * 3. Lazy loading - dependencies created only when needed
 * 4. Singletons - shared instances where appropriate (Prisma, EventDispatcher)
 * 5. Clear dependency graph
 *
 * Pattern: Service Locator + Singleton
 */
export class DependencyContainer {
    private static instance: DependencyContainer

    // Infrastructure - Singletons (shared across the application)
    private _prismaClient?: PrismaClient
    private _eventDispatcher?: EventDispatcher
    private _uuidService?: UUIDService

    // Repositories - Create on demand
    private _categoryRepository?: CreateCategoryOutputPort

    // Use Cases - Create on demand
    private _createCategoryUseCase?: CreateCategoryInputPort

    // Presenters - Singletons (stateless, can be reused)
    private _categoryPresenter?: CategoryPresenter

    /**
     * Private constructor - Singleton pattern
     * Use getInstance() to access the container
     */
    private constructor() {
        console.log("[DI Container] Initializing...")
    }

    /**
     * Get the singleton instance of the container
     */
    public static getInstance(): DependencyContainer {
        if (!DependencyContainer.instance) {
            DependencyContainer.instance = new DependencyContainer()
        }
        return DependencyContainer.instance
    }

    /**
     * Reset the container (useful for testing)
     */
    public static reset(): void {
        DependencyContainer.instance = new DependencyContainer()
    }

    // ===================================================================
    // INFRASTRUCTURE LAYER - Singletons
    // ===================================================================

    /**
     * Get Prisma Client (Singleton)
     * Same database connection used throughout the application
     */
    public get prismaClient(): PrismaClient {
        if (!this._prismaClient) {
            console.log("[DI Container] Creating PrismaClient...")
            this._prismaClient = prisma
        }
        return this._prismaClient
    }

    /**
     * Get Event Dispatcher (Singleton)
     * Same dispatcher instance with all registered handlers
     */
    public get eventDispatcher(): EventDispatcher {
        if (!this._eventDispatcher) {
            console.log("[DI Container] Creating EventDispatcher...")
            this._eventDispatcher = new InMemoryEventDispatcher()

            // Register all event handlers here
            this.registerEventHandlers(this._eventDispatcher)
        }
        return this._eventDispatcher
    }

    /**
     * Get UUID Service (Singleton)
     * Same UUID generator throughout the application
     */
    public get uuidService(): UUIDService {
        if (!this._uuidService) {
            console.log("[DI Container] Creating UUIDService...")
            this._uuidService = new UuidServiceImpl()
        }
        return this._uuidService
    }

    // ===================================================================
    // REPOSITORY LAYER
    // ===================================================================

    /**
     * Get Category Repository
     * Creates a new instance on each call (stateless)
     */
    public get categoryRepository(): CreateCategoryOutputPort {
        // For repositories, we could cache them or create new instances
        // Here we create new instances to ensure clean state
        console.log("[DI Container] Creating CategoryRepository...")
        return new PrismaCreateCategoryRepository()
    }

    // ===================================================================
    // USE CASE LAYER
    // ===================================================================

    /**
     * Get Create Category Use Case
     * Wires up all dependencies needed for creating a category
     */
    public get createCategoryUseCase(): CreateCategoryInputPort {
        if (!this._createCategoryUseCase) {
            console.log("[DI Container] Creating CreateCategoryUseCase...")
            this._createCategoryUseCase = new CreateCategoryUseCase(
                this.categoryRepository,
                this.uuidService,
                this.eventDispatcher
            )
        }
        return this._createCategoryUseCase
    }

    // ===================================================================
    // PRESENTER LAYER
    // ===================================================================

    /**
     * Get Category Presenter (Singleton)
     * Presenters are stateless, so we can reuse the same instance
     */
    public get categoryPresenter(): CategoryPresenter {
        if (!this._categoryPresenter) {
            console.log("[DI Container] Creating CategoryPresenter...")
            this._categoryPresenter = new CategoryPresenter()
        }
        return this._categoryPresenter
    }

    // ===================================================================
    // PRIVATE HELPERS
    // ===================================================================

    /**
     * Register all event handlers
     * This is where we wire up domain events to their handlers
     */
    private registerEventHandlers(dispatcher: EventDispatcher): void {
        console.log("[DI Container] Registering event handlers...")

        // Category events
        const categoryCreatedHandler = new CategoryCreatedHandler()
        dispatcher.register("CategoryCreated", categoryCreatedHandler)

        // TODO: Register more handlers as you create them
        // dispatcher.register("CategoryUpdated", new CategoryUpdatedHandler())
        // dispatcher.register("OrderCreated", new OrderCreatedHandler())
        // dispatcher.register("PaymentCompleted", new PaymentCompletedHandler())

        console.log("[DI Container] Event handlers registered")
    }

    // ===================================================================
    // UTILITY METHODS
    // ===================================================================

    /**
     * Cleanup resources (e.g., database connections)
     * Call this when shutting down the application
     */
    public async cleanup(): Promise<void> {
        console.log("[DI Container] Cleaning up...")
        if (this._prismaClient) {
            await this._prismaClient.$disconnect()
        }
    }
}

/**
 * Export a singleton instance for convenience
 * Usage: import { container } from '@infrastructure/di/container'
 */
export const container = DependencyContainer.getInstance()
