import { PrismaCreateProductRepository } from "./create-product-repository"

export const makeCreateProductRepository = async () => {
    return new PrismaCreateProductRepository()
}
