import { describe, expect, it, vi } from "vitest"

import * as generic from "../generic/run-express-endpoint"
import * as create from "./create"
import * as del from "./delete"
import * as getAll from "./get-all"
import * as getByCpf from "./get-by-cpf"
import * as getById from "./get-by-id"
import * as update from "./update"
import customerRouter from "./index"

vi.mock("./get-by-id", () => ({ getCustomerById: vi.fn() }))
vi.mock("./get-all", () => ({ getCustomerAll: vi.fn() }))
vi.mock("./create", () => ({ createCustomer: vi.fn() }))
vi.mock("./update", () => ({ updateCustomer: vi.fn() }))
vi.mock("./delete", () => ({ deleteCustomer: vi.fn() }))
vi.mock("./get-by-cpf", () => ({ getCustomerByCpf: vi.fn() }))
vi.mock("../generic/run-express-endpoint", () => ({
    runExpressEndpoint: vi.fn((fn, method) => fn),
}))

export {}

describe.skip("customerRouter", () => {
    it("should register all customer routes with correct handlers", () => {
        // Check that runExpressEndpoint is called with correct handlers and methods
        expect(generic.runExpressEndpoint).toHaveBeenCalledWith(
            getAll.getCustomerAll,
            "get"
        )
        expect(generic.runExpressEndpoint).toHaveBeenCalledWith(
            getById.getCustomerById,
            "get"
        )
        expect(generic.runExpressEndpoint).toHaveBeenCalledWith(
            getByCpf.getCustomerByCpf,
            "get"
        )
        expect(generic.runExpressEndpoint).toHaveBeenCalledWith(
            create.createCustomer,
            "post"
        )
        expect(generic.runExpressEndpoint).toHaveBeenCalledWith(
            update.updateCustomer,
            "put"
        )
        expect(generic.runExpressEndpoint).toHaveBeenCalledWith(
            del.deleteCustomer,
            "delete"
        )
    })

    it("should export a router", () => {
        expect(customerRouter).toBeDefined()
        expect(typeof customerRouter.use).toBe("function")
        expect(typeof customerRouter.get).toBe("function")
        expect(typeof customerRouter.post).toBe("function")
        expect(typeof customerRouter.put).toBe("function")
        expect(typeof customerRouter.delete).toBe("function")
    })
})
