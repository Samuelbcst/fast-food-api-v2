import { PrismaFindOrderAllOutputPort } from "./find-order-all-repository"

export const makeFindOrderAllOutputPort = async () => {
    return new PrismaFindOrderAllOutputPort()
}
