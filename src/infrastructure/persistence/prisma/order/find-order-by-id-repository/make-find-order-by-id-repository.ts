import { PrismaFindOrderByIdOutputPort } from "./find-order-by-id-repository"

export const makeFindOrderByIdOutputPort = async () => {
    return new PrismaFindOrderByIdOutputPort()
}

// Backwards-compatible alias
export const makeFindOrderByIdRepository = makeFindOrderByIdOutputPort
