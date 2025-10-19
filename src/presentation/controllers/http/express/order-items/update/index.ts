import { Request } from "express"
import { z } from "zod"
import { makeGetProductByIdFactory } from "../../products/get-by-id/make-product-get-by-id-dependencies"
import { makeUpdateOrderItemFactory } from "./make-order-item-update-dependencies"

export const updateOrderItem = async (
    params: Request["params"],
    body: Request["body"]
) => {
    const id = Number(params.id)
    if (isNaN(id)) throw new Error("Id must be a number")

    const { productId, quantity } = z
        .object({
            productId: z.number().int().positive(),
            quantity: z.number().int().positive(),
        })
        .parse(body)

    const productUseCase = await makeGetProductByIdFactory()
    const productResult = await productUseCase.execute({ id: productId })
    await productUseCase.onFinish()
    if (!productResult.success || !productResult.result) {
        throw new Error("Product not found")
    }

    const { name: productName, price: unitPrice } = productResult.result

    const updateInput: any = { id }
    if (productId !== undefined) updateInput.productId = productId
    if (quantity !== undefined) updateInput.quantity = quantity
    updateInput.productName = productName
    updateInput.unitPrice = unitPrice

    const useCase = await makeUpdateOrderItemFactory()
    const result = await useCase.execute(updateInput)
    await useCase.onFinish()

    return result
}
