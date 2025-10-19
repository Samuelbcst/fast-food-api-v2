import { PrismaFindCategoryAllRepository } from "./find-category-all-repository"

export const makeFindCategoryAllRepository = async () => {
    return new PrismaFindCategoryAllRepository()
}
