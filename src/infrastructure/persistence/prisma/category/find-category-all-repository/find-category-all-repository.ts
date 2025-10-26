import { Category } from "@entities/category/category"
import { prisma } from "@libraries/prisma/client"
import { FindCategoryAllOutputPort } from "@application/ports/output/category/find-category-all-output-port"

export class PrismaFindCategoryAllRepository
    implements FindCategoryAllOutputPort
{
    async execute(): Promise<Category[]> {
        const categories = await prisma.category.findMany()
        // Rehydrate rich domain Category instances from DB rows
        return categories.map((c) =>
            new Category(
                c.id.toString(),
                c.name,
                c.description ?? "",
                false
            )
        )
    }

    async finish() {
        await prisma.$disconnect()
    }
}
