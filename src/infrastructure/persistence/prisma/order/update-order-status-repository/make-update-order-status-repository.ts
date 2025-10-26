import { PrismaUpdateOrderStatusOutputPort } from "./update-order-status-repository"

export const makeUpdateOrderStatusOutputPort = async () => {
    return new PrismaUpdateOrderStatusOutputPort()
}

// Backwards-compatible alias
export const makeUpdateOrderStatusRepository = makeUpdateOrderStatusOutputPort
