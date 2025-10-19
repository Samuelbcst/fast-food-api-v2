import { PrismaUpdateOrderOutputPort } from "./update-order-repository"

export const makeUpdateOrderOutputPort = async () => {
    return new PrismaUpdateOrderOutputPort()
}
