import { FindProductAllInputPort } from "@application/ports/input/product/find-product-all-input"
import { FindProductAllOutputPort } from "@application/ports/output/product/find-product-all-output-port"

export class FindProductAllUseCase implements FindProductAllInputPort {
    constructor(private findProductAllOutputPort: FindProductAllOutputPort) {}

    async execute() {
        try {
            const products = await this.findProductAllOutputPort.execute()
            return {
                success: true,
                result: products,
            }
        } catch (error) {
            return {
                success: false,
                result: [],
            }
        }
    }

    onFinish(): Promise<void> {
        return this.findProductAllOutputPort.finish()
    }
}
