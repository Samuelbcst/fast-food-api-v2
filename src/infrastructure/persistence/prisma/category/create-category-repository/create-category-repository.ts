import { CreateCategoryOutputPort } from "@application/ports/output/category/create-category-output-port"
import { Category } from "@entities/category/category"
import { prisma } from "@libraries/prisma/client"

/**
 * Prisma implementation of CreateCategoryOutputPort
 *
 * This adapter translates between the domain (Category entity) and
 * the infrastructure (Prisma/PostgreSQL).
 */
export class PrismaCreateCategoryRepository
    implements CreateCategoryOutputPort
{
    async create(category: Category): Promise<Category> {
        // Persist to database using Prisma
        const savedCategory = await prisma.category.create({
            data: {
                // Do not pass domain string id to Prisma (DB expects numeric auto-generated id)
                name: category.name,
                description: category.description || null,
            },
        })

        // Reconstruct the domain entity from the database result
        // Note: We pass 'false' to prevent raising events for an existing entity
        // Reconstruct domain Category based on DB result. We pass raiseEvent=false
        // because this is a reconstruction from persistence.
        return new Category(
            savedCategory.id.toString(),
            savedCategory.name,
            savedCategory.description ?? "",
            false
        )
    }

    async finish() {
        await prisma.$disconnect()
    }
}

