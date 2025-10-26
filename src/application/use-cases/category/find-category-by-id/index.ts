import { CustomError } from "@application/use-cases/custom-error"
import { FindCategoryByIdCommand, FindCategoryByIdInputPort } from "@application/ports/input/category/find-category-by-id-input"
import { FindCategoryByIdOutputPort } from "@application/ports/output/category/find-category-by-id-output-port"

export class FindCategoryByIdUseCase implements FindCategoryByIdInputPort {
    constructor(
        private findCategoryByIdOutputPort: FindCategoryByIdOutputPort
    ) {}

    async execute(input: FindCategoryByIdCommand) {
        try {
            const category = await this.findCategoryByIdOutputPort.execute(
                input.id
            )

            if (!category) {
                return {
                    success: false,
                    result: null,
                    error: new CustomError("Category not found.", 404),
                }
            }

            return {
                success: category !== null,
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
        return this.findCategoryByIdOutputPort.finish()
    }
}
