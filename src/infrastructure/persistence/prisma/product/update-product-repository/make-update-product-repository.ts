import { PrismaUpdateProductOutputPort } from "./update-product-repository"

export const makeUpdateProductOutputPort = async () => {
    return new PrismaUpdateProductOutputPort()
}

// Backwards-compatible alias
export const makeUpdateProductRepository = makeUpdateProductOutputPort
