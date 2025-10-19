import { Product } from "@entities/product/product"
import { prisma } from "@libraries/prisma/client"
import { FindProductAllOutputPort } from "@application/ports/output/product/find-product-all-output-port"

export class PrismaFindProductAllOutputPort
    implements FindProductAllOutputPort
{
    async execute(): Promise<Product[]> {
        const products = await prisma.product.findMany()
        return products as Product[]
    }

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}
