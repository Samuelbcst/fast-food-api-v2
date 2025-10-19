import { PrismaFindOrderItemByIdOutputPort } from "./find-order-item-by-id-repository"

export const makeFindOrderItemByIdOutputPort = async () => {
    return new PrismaFindOrderItemByIdOutputPort()
}
