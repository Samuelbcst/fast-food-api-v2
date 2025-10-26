import { PrismaDeleteOrderOutputPort } from "./delete-order-repository"

export const makeDeleteOrderOutputPort = async () => {
    return new PrismaDeleteOrderOutputPort()
}

// Backwards-compatible alias
export const makeDeleteOrderRepository = makeDeleteOrderOutputPort
