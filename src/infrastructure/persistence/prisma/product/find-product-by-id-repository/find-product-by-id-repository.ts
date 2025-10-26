import { Product } from "@entities/product/product"
import { prisma } from "@libraries/prisma/client"
import { FindProductByIdOutputPort } from "@application/ports/output/product/find-product-by-id-output-port"

export class PrismaFindProductByIdOutputPort implements FindProductByIdOutputPort {
    async execute(id: number): Promise<Product | null> {
        const product = await prisma.product.findUnique({ where: { id } })
        if (!product) return null
        return new Product(
            product.id.toString(),
            product.name,
            product.description ?? undefined,
            product.price,
            product.categoryId.toString(),
            product.active ?? undefined,
            false
        )
    }

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}
