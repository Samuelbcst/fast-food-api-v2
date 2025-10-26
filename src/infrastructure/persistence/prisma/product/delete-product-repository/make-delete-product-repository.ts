import { PrismaDeleteProductOutputPort } from "./delete-product-repository"

export const makeDeleteProductOutputPort = async () => {
    return new PrismaDeleteProductOutputPort()
}
