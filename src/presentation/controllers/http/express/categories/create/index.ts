import { Request, Response } from "express"
import { z } from "zod"

import { BaseController } from "../../base-controller"
import { container } from "../../../../../../infrastructure/di/container"

/**
 * Create Category Controller
 *
 * CLEAN ARCHITECTURE + DEPENDENCY INJECTION PATTERN:
 * Instead of creating dependencies manually, we get them from the DI container.
 * This makes the code:
 * - Easier to test (can inject mocks)
 * - More maintainable (dependencies centralized)
 * - More efficient (shared singletons)
 */
class CreateCategoryController extends BaseController {
    async handle(req: Request, res: Response): Promise<void> {
        // Extract and validate input
        const { name, description } = z
            .object({
                name: z.string().min(1, "Name is required"),
                description: z.string().optional(),
            })
            .parse(this.extractBody(req))

        // Get use case from container
        // The container handles all dependency wiring
        const useCase = container.createCategoryUseCase

        // Execute use case
        const result = await useCase.execute({
            name,
            description: description || "",
        })
        await useCase.onFinish()

        // Get presenter from container
        const presenter = container.categoryPresenter
        const response = presenter.present(result)

        // Send HTTP response
        this.sendResponse(res, response)
    }
}

/**
 * Express endpoint function
 * Creates controller instance and delegates request handling
 *
 * Notice how simple this is now - no dependency creation!
 */
export const createCategory = async (req: Request, res: Response) => {
    const controller = new CreateCategoryController()
    await controller.handle(req, res)
}
