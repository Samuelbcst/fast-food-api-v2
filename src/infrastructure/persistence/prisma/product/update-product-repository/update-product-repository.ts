import { Product } from "@entities/product/product"
import { prisma } from "@libraries/prisma/client"
import { UpdateProductOutputPort } from "@application/ports/output/product/update-product-output-port"

export class PrismaUpdateProductOutputPort implements UpdateProductOutputPort {
    async execute(param: {
        id: Product["id"]
        name?: Product["name"]
        description?: Product["description"]
        price?: Product["price"]
        categoryId?: Product["categoryId"]
    }): Promise<Product | null> {
        const { id, name, description, price, categoryId } = param
        const product = await prisma.product.findUnique({ where: { id } })
        if (!product) return null
        const updateData: any = { updatedAt: new Date() }
        if (name !== undefined) updateData.name = name
        if (description !== undefined) updateData.description = description
        if (price !== undefined) updateData.price = price
        if (categoryId !== undefined) updateData.categoryId = categoryId
        const updated = await prisma.product.update({
            where: { id },
            data: updateData,
        })
        return updated as Product
    }

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}
