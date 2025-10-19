import { Product } from "@entities/product/product"
import { prisma } from "@libraries/prisma/client"
import { DeleteProductOutputPort } from "@application/ports/output/product/delete-product-output-port"

export class PrismaDeleteProductOutputPort implements DeleteProductOutputPort {
    async execute(id: number): Promise<Product | null> {
        const product = await prisma.product.findUnique({ where: { id } })
        if (!product) return null
        await prisma.product.delete({ where: { id } })
        return product as Product
    }

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}
