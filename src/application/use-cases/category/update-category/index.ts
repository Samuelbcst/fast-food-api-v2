import { CustomError } from "@use-cases/custom-error"
import { UpdateCategoryCommand, UpdateCategoryInputPort } from "@application/ports/input/category/update-category-input"
import { UpdateCategoryOutputPort } from "@application/ports/output/category/update-category-output-port"

export class UpdateCategoryUseCase implements UpdateCategoryInputPort {
    constructor(private updateCategoryOutputPort: UpdateCategoryOutputPort) {}

    async execute(input: UpdateCategoryCommand) {
        try {
            const category = await this.updateCategoryOutputPort.execute(input)

            if (!category) {
                return {
                    success: false,
                    result: null,
                    error: new CustomError(404, "Category not found."),
                }
            }

            return {
                success: true,
                result: category,
            }
        } catch (error) {
            return {
                success: false,
                result: null,
            }
        }
    }

    onFinish(): Promise<void> {
        return this.updateCategoryOutputPort.finish()
    }
}
