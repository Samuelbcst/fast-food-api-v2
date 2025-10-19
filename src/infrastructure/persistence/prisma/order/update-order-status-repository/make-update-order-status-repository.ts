import { PrismaUpdateOrderStatusOutputPort } from "./update-order-status-repository"

export const makeUpdateOrderStatusOutputPort = async () => {
    return new PrismaUpdateOrderStatusOutputPort()
}
