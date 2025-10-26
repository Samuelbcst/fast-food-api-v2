import { CreateOrderPersistenceInput } from "@application/ports/output/order/create-order-output-port"
import { OrderStatus } from "@entities/order/order"
import { Product } from "@entities/product/product"
import { CustomError } from "@application/use-cases/custom-error"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { CreateOrderUseCase } from "."

describe.skip("CreateOrderUseCase", () => {
    const mockOrder: any = {
        id: 42,
        customerId: 1,
        status: OrderStatus.RECEIVED,
        statusUpdatedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        totalAmount: 30,
        items: [],
    }

    const makeRepositories = () => {
        const orderRepository = {
            create: vi.fn().mockResolvedValue(mockOrder),
            finish: vi.fn().mockResolvedValue(undefined),
        }
        const productRepository = {
            execute: vi
                .fn()
                .mockResolvedValue<Product>({
                    id: 10,
                    name: "Burger",
                    description: "Test burger",
                    price: 15,
                    categoryId: 1,
                    active: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }),
            finish: vi.fn().mockResolvedValue(undefined),
        }
        return { orderRepository, productRepository }
    }

    let orderRepository: ReturnType<typeof makeRepositories>["orderRepository"]
    let productRepository: ReturnType<typeof makeRepositories>["productRepository"]
    let useCase: CreateOrderUseCase

    beforeEach(() => {
        ;({ orderRepository, productRepository } = makeRepositories())
        useCase = new CreateOrderUseCase(orderRepository, productRepository)
    })

    it("should create an order and return its id", async () => {
        const input = { customerId: 1, items: [{ productId: 10, quantity: 2 }] }

        const result = await useCase.execute(input)

        expect(result.success).toBe(true)
        expect(result.result).toEqual({ id: mockOrder.id })

        expect(orderRepository.create).toHaveBeenCalledTimes(1)
        const persisted: CreateOrderPersistenceInput =
            orderRepository.create.mock.calls[0][0]
        expect(persisted.status).toBe(OrderStatus.RECEIVED)
        expect(persisted.totalAmount).toBe(30)
        expect(persisted.items).toEqual([
            {
                productId: 10,
                productName: "Burger",
                unitPrice: 15,
                quantity: 2,
            },
        ])
    })

    it("should fail when items list is empty", async () => {
        const result = await useCase.execute({ customerId: 1, items: [] })
        expect(result.success).toBe(false)
        expect(result.result).toBeNull()
        expect(result.error).toBeInstanceOf(CustomError)
        expect(result.error?.message).toMatch(/at least one item/i)
        expect(orderRepository.create).not.toHaveBeenCalled()
    })

    it("should fail when a product is not found", async () => {
        productRepository.execute.mockResolvedValueOnce(null)
        const result = await useCase.execute({
            customerId: 1,
            items: [{ productId: 999, quantity: 1 }],
        })
        expect(result.success).toBe(false)
        expect(result.error).toBeInstanceOf(CustomError)
        expect(result.error?.code).toBe(404)
        expect(orderRepository.create).not.toHaveBeenCalled()
    })

    it("should wrap repository errors into CustomError", async () => {
        const message = "Persistence error"
        orderRepository.create.mockRejectedValueOnce(new Error(message))

        const result = await useCase.execute({
            customerId: 1,
            items: [{ productId: 10, quantity: 2 }],
        })

        expect(result.success).toBe(false)
        expect(result.error).toBeInstanceOf(CustomError)
        expect(result.error?.message).toBe(message)
    })

    it("should call finish on both repositories", async () => {
        await useCase.onFinish()
        expect(orderRepository.finish).toHaveBeenCalled()
        expect(productRepository.finish).toHaveBeenCalled()
    })
})
