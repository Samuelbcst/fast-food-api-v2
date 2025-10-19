import { PrismaDeleteProductRepository } from "./delete-product-repository"

export const makeDeleteProductRepository = async () => {
    return new PrismaDeleteProductRepository()
}
