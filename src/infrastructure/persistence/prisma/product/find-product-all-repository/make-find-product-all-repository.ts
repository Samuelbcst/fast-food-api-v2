import { PrismaFindProductAllOutputPort } from "./find-product-all-repository"

export const makeFindProductAllOutputPort = async () => {
    return new PrismaFindProductAllOutputPort()
}
