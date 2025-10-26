import { PrismaDeleteProductOutputPort } from "./delete-product-repository"

export const makeDeleteProductOutputPort = async () => {
    return new PrismaDeleteProductOutputPort()
}

// Backwards-compatible alias
export const makeDeleteProductRepository = makeDeleteProductOutputPort
