import { Category } from "@domain/entities/category/category"

/**
 * Output Port (Secondary Port) for Category operations
 * Defines the interface that infrastructure adapters must implement
 * This is what the use cases depend on (Dependency Inversion Principle)
 */
export interface CategoryOutputPort {
    /**
     * Save a new category to the persistence layer
     */
    save(category: Category): Promise<Category>

    /**
     * Find a category by its unique identifier
     */
    findById(id: number): Promise<Category | null>

    /**
     * Retrieve all categories
     */
    findAll(): Promise<Category[]>

    /**
     * Update an existing category
     */
    update(category: Category): Promise<Category>

    /**
     * Delete a category by its identifier
     */
    delete(id: number): Promise<void>
}
