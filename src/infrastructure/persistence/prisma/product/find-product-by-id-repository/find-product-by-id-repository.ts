import { Product } from "@entities/product/product"
import { prisma } from "@libraries/prisma/client"
import { FindProductByIdOutputPort } from "@application/ports/output/product/find-product-by-id-output-port"

export class PrismaFindProductByIdOutputPort
    implements FindProductByIdOutputPort
{
    async execute(id: Product["id"]): Promise<Product | null> {
        const product = await prisma.product.findUnique({ where: { id } })
        return product as Product | null
    }

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}
