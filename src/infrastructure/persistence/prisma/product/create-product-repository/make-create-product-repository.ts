import { PrismaCreateProductOutputPort } from "./create-product-repository"

export const makeCreateProductRepository = async () => {
    return new PrismaCreateProductOutputPort()
}

// Backwards-compatible alias expected by some tests
export const makeCreateProductOutputPort = makeCreateProductRepository
