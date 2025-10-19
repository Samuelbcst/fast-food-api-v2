import { describe, expect, it, vi } from "vitest"
import * as generic from "../generic/run-express-endpoint"
import * as create from "./create"
import * as del from "./delete"
import * as getAll from "./get-all"
import * as getById from "./get-by-id"
import * as update from "./update"
import orderItemRouter from "./index"

vi.mock("./get-by-id", () => ({ getOrderItemById: vi.fn() }))
vi.mock("./get-all", () => ({ getOrderItemAll: vi.fn() }))
vi.mock("./create", () => ({ createOrderItem: vi.fn() }))
vi.mock("./update", () => ({ updateOrderItem: vi.fn() }))
vi.mock("./delete", () => ({ deleteOrderItem: vi.fn() }))
vi.mock("../generic/run-express-endpoint", () => ({
    runExpressEndpoint: vi.fn((fn, method) => fn),
}))

export {}

describe("orderItemRouter", () => {
    it("should register all order-item routes with correct handlers", () => {
        expect(generic.runExpressEndpoint).toHaveBeenCalledWith(
            getAll.getOrderItemAll,
            "get"
        )
        expect(generic.runExpressEndpoint).toHaveBeenCalledWith(
            getById.getOrderItemById,
            "get"
        )
        expect(generic.runExpressEndpoint).toHaveBeenCalledWith(
            create.createOrderItem,
            "post"
        )
        expect(generic.runExpressEndpoint).toHaveBeenCalledWith(
            update.updateOrderItem,
            "put"
        )
        expect(generic.runExpressEndpoint).toHaveBeenCalledWith(
            del.deleteOrderItem,
            "delete"
        )
    })

    it("should export a router", () => {
        expect(orderItemRouter).toBeDefined()
        expect(typeof orderItemRouter.use).toBe("function")
        expect(typeof orderItemRouter.get).toBe("function")
        expect(typeof orderItemRouter.post).toBe("function")
        expect(typeof orderItemRouter.put).toBe("function")
        expect(typeof orderItemRouter.delete).toBe("function")
    })
})
