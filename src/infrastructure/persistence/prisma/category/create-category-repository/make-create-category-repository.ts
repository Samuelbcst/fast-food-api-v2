import { PrismaCreateCategoryRepository } from "./create-category-repository"

export const makeCreateCategoryRepository = async () => {
    return new PrismaCreateCategoryRepository()
}
