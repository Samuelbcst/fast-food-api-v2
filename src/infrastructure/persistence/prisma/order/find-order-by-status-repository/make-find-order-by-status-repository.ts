import { PrismaFindOrderByStatusOutputPort } from "./find-order-by-status-repository"

export const makeFindOrderByStatusOutputPort = async () => {
    return new PrismaFindOrderByStatusOutputPort()
}
