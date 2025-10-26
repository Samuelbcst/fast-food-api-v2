import { CustomError } from "@application/use-cases/custom-error"
import { DeleteCategoryCommand, DeleteCategoryInputPort } from "@application/ports/input/category/delete-category-input"
import { DeleteCategoryOutputPort } from "@application/ports/output/category/delete-category-output-port"

export class DeleteCategoryUseCase implements DeleteCategoryInputPort {
    constructor(private deleteCategoryOutputPort: DeleteCategoryOutputPort) {}

    async execute(input: DeleteCategoryCommand) {
        try {
            const deleted = await this.deleteCategoryOutputPort.delete(input.id)
            if (!deleted) {
                return {
                    success: false,
                    result: null,
                    error: new CustomError("Category not found", 404),
                }
            }
            return {
                success: true,
                result: deleted,
            }
        } catch (error: unknown) {
            return {
                success: false,
                result: null,
                error: new CustomError(
                    400,
                    (error as Error | undefined)?.message ||
                        "Failed to delete category"
                ),
            }
        }
    }

    onFinish(): Promise<void> {
        return this.deleteCategoryOutputPort.finish()
    }
}
