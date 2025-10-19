import { PrismaUpdateProductRepository } from "./update-product-repository"

export const makeUpdateProductRepository = async () => {
    return new PrismaUpdateProductRepository()
}
