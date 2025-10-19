import { PrismaDeleteCategoryRepository } from "./delete-category-repository"

export const makeDeleteCategoryRepository = async () => {
    return new PrismaDeleteCategoryRepository()
}
