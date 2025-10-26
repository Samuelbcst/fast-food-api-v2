import { PrismaFindOrderAllOutputPort } from "./find-order-all-repository"

export const makeFindOrderAllOutputPort = async () => {
    return new PrismaFindOrderAllOutputPort()
}

// Backwards-compatible alias
export const makeFindOrderAllRepository = makeFindOrderAllOutputPort
