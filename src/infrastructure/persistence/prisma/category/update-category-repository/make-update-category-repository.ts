import { PrismaUpdateCategoryRepository } from "./update-category-repository"

export const makeUpdateCategoryRepository = async () => {
    return new PrismaUpdateCategoryRepository()
}
