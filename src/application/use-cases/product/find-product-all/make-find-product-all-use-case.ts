import { FindProductAllInputPort } from "@application/ports/input/product/find-product-all-input"
import { FindProductAllOutputPort } from "@application/ports/output/product/find-product-all-output-port"
import { FindProductAllUseCase } from "."

export const makeFindProductAllUseCase = (
    repository: FindProductAllOutputPort
): FindProductAllInputPort => new FindProductAllUseCase(repository)
