import { CategoryCreatedHandler } from "@application/event-handlers/category-created-handler"
import { makeCreateCategoryRepository } from "@persistence/prisma/category/create-category-repository/make-create-category-repository"
import { makeCreateCategoryUseCase } from "@application/use-cases/category/create-category/make-create-category-use-case"
import { InMemoryEventDispatcher } from "../../../../../../infrastructure/events/in-memory-event-dispatcher"
import { UuidServicesImpl } from "../../../../../../infrastructure/services/UuidServicesImpl"

/**
 * Factory to create all dependencies for the Create Category endpoint
 *
 * This is where we wire up all the dependencies:
 * 1. Create the repository (data access)
 * 2. Create the event dispatcher and register handlers
 * 3. Create the UUID service
 * 4. Inject everything into the use case
 */
export const makeCreateCategoryFactory = async () => {
    // Create repository
    const repository = await makeCreateCategoryRepository()

    // Create UUID service
    const uuidService = new UuidServicesImpl()

    // Create event dispatcher and register handlers
    const eventDispatcher = new InMemoryEventDispatcher()

    // Register the CategoryCreatedHandler
    // This handler will be called whenever a CategoryCreatedEvent is dispatched
    const categoryCreatedHandler = new CategoryCreatedHandler()
    eventDispatcher.register("CategoryCreated", categoryCreatedHandler)

    console.log("[Factory] Event dispatcher configured with handlers")

    // Create and return the use case with all dependencies
    const useCase = makeCreateCategoryUseCase(
        repository,
        uuidService,
        eventDispatcher
    )

    return useCase
}
