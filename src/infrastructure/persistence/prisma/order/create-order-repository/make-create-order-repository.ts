import { PrismaCreateOrderOutputPort } from "./create-order-repository"

export const makeCreateOrderRepository = async () => {
    return new PrismaCreateOrderOutputPort()
}

export const makeCreateOrderOutputPort = makeCreateOrderRepository
