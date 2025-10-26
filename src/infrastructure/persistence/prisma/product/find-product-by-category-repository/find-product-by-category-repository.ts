import { Product } from "@entities/product/product"
import { prisma } from "@libraries/prisma/client"
import { FindProductByCategoryOutputPort } from "@application/ports/output/product/find-product-by-category-output-port"

export class PrismaFindProductByCategoryOutputPort
    implements FindProductByCategoryOutputPort
{
    async execute(categoryId: number): Promise<Product[]> {
        const products = await prisma.product.findMany({
            where: { categoryId },
        })
        return products.map((p) =>
            new Product(
                p.id.toString(),
                p.name,
                p.description ?? undefined,
                p.price,
                p.categoryId.toString(),
                p.active ?? undefined,
                false
            )
        )
    }

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}
