import { CreateOrderInputPort } from "@application/ports/input/order/create-order-input"
import { CreateOrderOutputPort } from "@application/ports/output/order/create-order-output-port"
import { FindProductByIdOutputPort } from "@application/ports/output/product/find-product-by-id-output-port"
import { UnitOfWork } from "@application/ports/output/unit-of-work"
import { CreateOrderUseCase } from "."

/**
 * Factory for CreateOrderUseCase
 * Injects all required dependencies including UnitOfWork for transaction management
 */
export const makeCreateOrderUseCase = (
    repository: CreateOrderOutputPort,
    productRepository: FindProductByIdOutputPort,
    unitOfWork: UnitOfWork
): CreateOrderInputPort =>
    new CreateOrderUseCase(repository, productRepository, unitOfWork)
