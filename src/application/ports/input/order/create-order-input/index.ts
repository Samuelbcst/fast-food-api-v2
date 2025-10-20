import { UseCase } from "@application/use-cases/base-use-case"

export interface CreateOrderItemCommand {
    productId: number
    quantity: number
}

export interface CreateOrderCommand {
    customerId?: number
    items: CreateOrderItemCommand[]
}

export interface CreateOrderInputPort
    extends UseCase<CreateOrderCommand, { id: number }> {}
