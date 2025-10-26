import { PrismaUpdateOrderOutputPort } from "./update-order-repository"

export const makeUpdateOrderOutputPort = async () => {
    return new PrismaUpdateOrderOutputPort()
}

// Backwards-compatible alias
export const makeUpdateOrderRepository = makeUpdateOrderOutputPort
