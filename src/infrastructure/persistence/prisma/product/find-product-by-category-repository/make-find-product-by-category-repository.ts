import { PrismaFindProductByCategoryRepository } from "./find-product-by-category-repository"

export const makeFindProductByCategoryRepository = async () => {
    return new PrismaFindProductByCategoryRepository()
}
