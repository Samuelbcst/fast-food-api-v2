import { PrismaDeleteOrderOutputPort } from "./delete-order-repository"

export const makeDeleteOrderOutputPort = async () => {
    return new PrismaDeleteOrderOutputPort()
}
