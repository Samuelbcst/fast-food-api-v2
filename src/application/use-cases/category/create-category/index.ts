import { CustomError } from "@application/use-cases/custom-error"
import { CreateCategoryCommand, CreateCategoryInputPort } from "@application/ports/input/category/create-category-input"
import { CreateCategoryOutputPort } from "@application/ports/output/category/create-category-output-port"


export class CreateCategoryUseCase
    implements CreateCategoryInputPort
{
    constructor(private createCategoryOutputPort: CreateCategoryOutputPort) {}

    async execute(input: CreateCategoryCommand) {
        try {
            const created = await this.createCategoryOutputPort.create(input)
            return {
                success: true,
                result: created,
            }
        } catch (error: unknown) {
            return {
                success: false,
                result: null,
                error: new CustomError(
                    400,
                    (error as Error | undefined)?.message ||
                        "Failed to create category"
                ),
            }
        }
    }

    onFinish(): Promise<void> {
        return this.createCategoryOutputPort.finish()
    }
}
