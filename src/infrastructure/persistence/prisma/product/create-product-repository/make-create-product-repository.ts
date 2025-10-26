import { PrismaCreateProductOutputPort } from "./create-product-repository"

export const makeCreateProductRepository = async () => {
    return new PrismaCreateProductOutputPort()
}
