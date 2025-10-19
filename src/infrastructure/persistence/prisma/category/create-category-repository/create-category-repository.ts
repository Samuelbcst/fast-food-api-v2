import { BaseEntity } from "@entities/base-entity"
import { Category } from "@entities/category/category"
import { prisma } from "@libraries/prisma/client"
import { CreateCategoryOutputPort } from "@application/ports/output/category/create-category-output-port"

export class PrismaCreateCategoryRepository
    implements CreateCategoryOutputPort
{
    async create({ name, description }: Omit<Category, keyof BaseEntity>) {
        const category = await prisma.category.create({
            data: { name, description },
        })
        return {
            ...category,
            description:
                category.description === null
                    ? undefined
                    : category.description,
        }
    }

    async finish() {
        await prisma.$disconnect()
    }
}
