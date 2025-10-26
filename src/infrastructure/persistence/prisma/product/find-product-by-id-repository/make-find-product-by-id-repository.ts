import { PrismaFindProductByIdOutputPort } from "./find-product-by-id-repository"

export const makeFindProductByIdOutputPort = async () => {
    return new PrismaFindProductByIdOutputPort()
}

// Backwards-compatible alias
export const makeFindProductByIdRepository = makeFindProductByIdOutputPort
