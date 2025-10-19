import { Category } from "@entities/category/category"
import { prisma } from "@libraries/prisma/client"
import { DeleteCategoryOutputPort } from "@application/ports/output/category/delete-category-output-port"

export class PrismaDeleteCategoryRepository
    implements DeleteCategoryOutputPort
{
    async delete(id: number): Promise<Category | null> {
        const category = await prisma.category.findUnique({ where: { id } })
        if (!category) return null
        await prisma.category.delete({ where: { id } })
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
