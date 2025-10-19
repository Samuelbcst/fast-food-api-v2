import { PrismaUpdateOrderItemOutputPort } from "./update-order-item-repository"

export const makeUpdateOrderItemOutputPort = async () => {
    return new PrismaUpdateOrderItemOutputPort()
}
