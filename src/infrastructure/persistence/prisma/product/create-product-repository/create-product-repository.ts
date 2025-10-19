import { BaseEntity } from "@entities/base-entity"
import { Product } from "@entities/product/product"
import { prisma } from "@libraries/prisma/client"
import { CreateProductOutputPort } from "@application/ports/output/product/create-product-output-port"

export class PrismaCreateProductOutputPort implements CreateProductOutputPort {
    async create(input: Omit<Product, keyof BaseEntity>): Promise<Product> {
        const product = await prisma.product.create({
            data: input,
        })
        return product as Product
    }

    async finish(): Promise<void> {
        await prisma.$disconnect()
    }
}
