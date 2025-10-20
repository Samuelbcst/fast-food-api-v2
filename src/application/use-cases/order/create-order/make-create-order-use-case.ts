import { CreateOrderInputPort } from "@application/ports/input/order/create-order-input"
import { CreateOrderOutputPort } from "@application/ports/output/order/create-order-output-port"
import { FindProductByIdOutputPort } from "@application/ports/output/product/find-product-by-id-output-port"
import { CreateOrderUseCase } from "."

export const makeCreateOrderUseCase = (
    repository: CreateOrderOutputPort,
    productRepository: FindProductByIdOutputPort
): CreateOrderInputPort =>
    new CreateOrderUseCase(repository, productRepository)
