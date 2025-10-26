import { Category } from "@entities/category/category"
import { prisma } from "@libraries/prisma/client"
import { UpdateCategoryOutputPort } from "@application/ports/output/category/update-category-output-port"

export class PrismaUpdateCategoryRepository
    implements UpdateCategoryOutputPort
{
    async execute(param: {
        id: number
        name?: string
        description?: string
    }): Promise<Category | null> {
        const { id, name, description } = param
        const category = await prisma.category.findUnique({ where: { id } })
        if (!category) return null
        const updatedCategory = await prisma.category.update({
            where: { id },
            data: {
                name: name !== undefined ? name : category.name,
                description:
                    description !== undefined ? description : category.description,
                updatedAt: new Date(),
            },
        })
        return new Category(
            updatedCategory.id.toString(),
            updatedCategory.name,
            updatedCategory.description ?? "",
            false
        )
    }

    async finish() {
        await prisma.$disconnect()
    }
}
