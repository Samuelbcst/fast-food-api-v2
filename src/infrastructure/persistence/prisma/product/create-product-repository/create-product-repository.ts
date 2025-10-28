import { Product } from "@entities/product/product"
import { prisma } from "@libraries/prisma/client"
import { CreateProductOutputPort } from "@application/ports/output/product/create-product-output-port"

export class PrismaCreateProductOutputPort implements CreateProductOutputPort {
    async create(input: {
        name: string
        description?: string | null
        price: number
        categoryId: number
        active?: boolean | null
    }): Promise<Product> {
        const created = await prisma.product.create({
            data: input,
        })
        // Reconstruct rich domain Product using DB id -> domain id (string)
        return new Product(
            created.id.toString(),
            created.name,
            created.description ?? undefined,
            created.price,
            created.categoryId.toString(),
            created.active ?? undefined,
            false
        )
    }

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}
