import { PrismaFindProductByCategoryOutputPort } from "./find-product-by-category-repository"

export const makeFindProductByCategoryOutputPort = async () => {
    return new PrismaFindProductByCategoryOutputPort()
}

// Backwards-compatible alias
export const makeFindProductByCategoryRepository = makeFindProductByCategoryOutputPort
