import { CreateCategoryInputPort } from "@application/ports/input/category/create-category-input"
import { CreateCategoryOutputPort } from "@application/ports/output/category/create-category-output-port"
import { EventDispatcher } from "@domain/events/event-dispatcher"
import { UUIDService } from "@domain/services/UUIDService"
import { CreateCategoryUseCase } from "."

/**
 * Factory function to create a CreateCategoryUseCase
 *
 * This follows the Dependency Injection pattern, allowing us to
 * inject all dependencies the use case needs.
 */
export const makeCreateCategoryUseCase = (
    repository: CreateCategoryOutputPort,
    uuidService: UUIDService,
    eventDispatcher: EventDispatcher
): CreateCategoryInputPort =>
    new CreateCategoryUseCase(repository, uuidService, eventDispatcher)
