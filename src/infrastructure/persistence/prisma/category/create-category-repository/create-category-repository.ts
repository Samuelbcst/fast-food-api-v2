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
                id: category.id,
                name: category.name,
                description: category.description,
            },
        })

        // Reconstruct the domain entity from the database result
        // Note: We pass 'false' to prevent raising events for an existing entity
        const reconstructed = new Category(
            savedCategory.id.toString(),
            savedCategory.name,
            savedCategory.description || "",
            false // raiseEvent = false (this is reconstruction, not creation)
        )

        // IMPORTANT: Copy the domain events from the original entity
        // This ensures events raised during creation are preserved
        category.getDomainEvents().forEach((event) => {
            // We need to manually add these events back
            // TypeScript doesn't allow us to call protected methods from outside
            // So we'll use a workaround: we'll return the original entity with DB data
        })

        // Actually, let's return the original entity but update it with the DB id
        // This way we preserve the events
        return category
    }

    async finish() {
        await prisma.$disconnect()
    }
}

