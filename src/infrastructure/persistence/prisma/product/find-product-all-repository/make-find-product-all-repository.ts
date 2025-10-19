import { PrismaFindProductAllRepository } from "./find-product-all-repository"

export const makeFindProductAllRepository = async () => {
    return new PrismaFindProductAllRepository()
}
