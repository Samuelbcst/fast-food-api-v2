import { PrismaDeleteOrderItemOutputPort } from "./delete-order-item-repository"

export const makeDeleteOrderItemOutputPort = async () => {
    return new PrismaDeleteOrderItemOutputPort()
}
