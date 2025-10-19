import { Category } from "@entities/category/category"
import { prisma } from "@libraries/prisma/client"
import { FindCategoryAllOutputPort } from "@application/ports/output/category/find-category-all-output-port"

export class PrismaFindCategoryAllRepository
    implements FindCategoryAllOutputPort
{
    async execute(): Promise<Category[]> {
        const categories = await prisma.category.findMany()
        return categories.map((category) => ({
            ...category,
            description:
                category.description === null
                    ? undefined
                    : category.description,
        }))
    }

    async finish() {
        await prisma.$disconnect()
    }
}
