import { PrismaFindCategoryByIdRepository } from "./find-category-by-id-repository"

export const makeFindCategoryByIdRepository = async () => {
    return new PrismaFindCategoryByIdRepository()
}
