import { Category } from "@entities/category/category"
import { prisma } from "@libraries/prisma/client"
import { FindCategoryByIdOutputPort } from "@application/ports/output/category/find-category-by-id-output-port"

export class PrismaFindCategoryByIdRepository
    implements FindCategoryByIdOutputPort
{
    async execute(id: number): Promise<Category | null> {
        const category = await prisma.category.findUnique({ where: { id } })
        if (!category) return null
        return new Category(
            category.id.toString(),
            category.name,
            category.description ?? "",
            false
        )
    }

    async finish() {
        await prisma.$disconnect()
    }
}
