import { PrismaFindOrderItemAllOutputPort } from "./find-order-item-all-repository"

export const makeFindOrderItemAllOutputPort = async () => {
    return new PrismaFindOrderItemAllOutputPort()
}
