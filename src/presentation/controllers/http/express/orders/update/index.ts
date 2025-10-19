import { Request } from "express"
import { z } from "zod"
import { makeGetProductByIdFactory } from "../../products/get-by-id/make-product-get-by-id-dependencies"
import { makeUpdateOrderFactory } from "./make-order-update-dependencies"

export const updateOrder = async (
    params: Request["params"],
    body: Request["body"]
) => {
    const id = Number(params.id)
    if (isNaN(id)) throw new Error("Id must be a number")

    const { customerId, items } = z
        .object({
            customerId: z.number().int().positive().optional(),
            items: z
                .array(
                    z.object({
                        productId: z.number().int().positive(),
                        quantity: z.number().int().positive(),
                    })
                )
                .optional(),
        })
        .parse(body)

    const updateInput: any = { id }
    if (customerId !== undefined) updateInput.customerId = customerId
    if (items !== undefined) {
        const productUseCase = await makeGetProductByIdFactory()
        const now = new Date()
        const mappedItems = []
        for (const item of items) {
            const productResult = await productUseCase.execute({
                id: item.productId,
            })
            if (!productResult.success || !productResult.result) {
                await productUseCase.onFinish()
                throw new Error(`Product not found: ${item.productId}`)
            }
            const { name: productName, price: unitPrice } = productResult.result
            mappedItems.push({
                productId: item.productId,
                quantity: item.quantity,
                productName,
                unitPrice,
                createdAt: now,
                updatedAt: now,
            })
        }
        await productUseCase.onFinish()
        updateInput.items = mappedItems
        updateInput.totalAmount = mappedItems.reduce(
            (sum, item) => sum + item.unitPrice * item.quantity,
            0
        )
    }

    const useCase = await makeUpdateOrderFactory()
    const result = await useCase.execute(updateInput)
    await useCase.onFinish()
    return result
}
