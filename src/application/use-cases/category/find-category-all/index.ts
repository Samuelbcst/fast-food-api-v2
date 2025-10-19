import { FindCategoryAllInputPort } from "@application/ports/input/category/find-category-all-input"
import { FindCategoryAllOutputPort } from "@application/ports/output/category/find-category-all-output-port"

export class FindCategoryAllUseCase implements FindCategoryAllInputPort {
    constructor(private findCategoryAllOutputPort: FindCategoryAllOutputPort) {}

    async execute() {
        try {
            const categories = await this.findCategoryAllOutputPort.execute()
            return {
                success: true,
                result: categories,
            }
        } catch (error) {
            return {
                success: false,
                result: [],
            }
        }
    }

    onFinish(): Promise<void> {
        return this.findCategoryAllOutputPort.finish()
    }
}
