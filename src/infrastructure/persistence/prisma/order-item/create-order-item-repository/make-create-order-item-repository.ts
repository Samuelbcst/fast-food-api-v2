import { PrismaCreateOrderItemOutputPort } from "./create-order-item-repository"

export const makeCreateOrderItemOutputPort = async () => {
    return new PrismaCreateOrderItemOutputPort()
}
