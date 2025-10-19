import { PrismaFindProductByIdRepository } from "./find-product-by-id-repository"

export const makeFindProductByIdRepository = async () => {
    return new PrismaFindProductByIdRepository()
}
