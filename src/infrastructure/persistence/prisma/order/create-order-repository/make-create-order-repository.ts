import { PrismaCreateOrderOutputPort } from "./create-order-repository"

export const makeCreateOrderOutputPort = async () => {
    return new PrismaCreateOrderOutputPort()
}
