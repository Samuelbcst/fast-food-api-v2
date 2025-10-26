import { Product } from "@entities/product/product"
import { prisma } from "@libraries/prisma/client"
import { DeleteProductOutputPort } from "@application/ports/output/product/delete-product-output-port"

export class PrismaDeleteProductOutputPort implements DeleteProductOutputPort {
    async execute(idOrParam: number | { id: number }): Promise<Product | null> {
        const id = typeof idOrParam === "number" ? idOrParam : idOrParam.id
        const product = await prisma.product.findUnique({ where: { id } })
        if (!product) return null
        const deleted = await prisma.product.delete({ where: { id } })
        if (!deleted) return null
        return new Product(
            deleted.id.toString(),
            deleted.name,
            deleted.description ?? undefined,
            deleted.price,
            deleted.categoryId.toString(),
            deleted.active ?? undefined,
            false
        )
    }

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}
