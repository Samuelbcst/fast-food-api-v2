import { describe, expect, it, vi } from "vitest"
import * as generic from "../generic/run-express-endpoint"
import * as create from "./create"
import * as del from "./delete"
import * as getAll from "./get-all"
import * as getById from "./get-by-id"
import * as update from "./update"
import paymentRouter from "./index"

vi.mock("./get-by-id", () => ({ getPaymentById: vi.fn() }))
vi.mock("./get-all", () => ({ getPaymentAll: vi.fn() }))
vi.mock("./create", () => ({ createPayment: vi.fn() }))
vi.mock("./update", () => ({ updatePayment: vi.fn() }))
vi.mock("./delete", () => ({ deletePayment: vi.fn() }))
vi.mock("../generic/run-express-endpoint", () => ({
    runExpressEndpoint: vi.fn((fn, method) => fn),
}))

export {}

describe("paymentRouter", () => {
    it("should register all payment routes with correct handlers", () => {
        expect(generic.runExpressEndpoint).toHaveBeenCalledWith(
            getAll.getPaymentAll,
            "get"
        )
        expect(generic.runExpressEndpoint).toHaveBeenCalledWith(
            getById.getPaymentById,
            "get"
        )
        expect(generic.runExpressEndpoint).toHaveBeenCalledWith(
            create.createPayment,
            "post"
        )
        expect(generic.runExpressEndpoint).toHaveBeenCalledWith(
            update.updatePayment,
            "put"
        )
        expect(generic.runExpressEndpoint).toHaveBeenCalledWith(
            del.deletePayment,
            "delete"
        )
    })

    it("should export a router", () => {
        expect(paymentRouter).toBeDefined()
        expect(typeof paymentRouter.use).toBe("function")
        expect(typeof paymentRouter.get).toBe("function")
        expect(typeof paymentRouter.post).toBe("function")
        expect(typeof paymentRouter.put).toBe("function")
        expect(typeof paymentRouter.delete).toBe("function")
    })
})
