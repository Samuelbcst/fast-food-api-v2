import { describe, expect, it, vi } from "vitest"

import { runExpressEndpoint } from "./run-express-endpoint"

describe("runExpressEndpoint", () => {
    it("should call fn and send result", async () => {
        const fn = vi
            .fn()
            .mockResolvedValue({ success: true, result: { foo: "bar" } })
        const req = { params: {}, body: {} } as any
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any
        const handler = runExpressEndpoint(fn, "get")
        await handler(req, res)
        expect(fn).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ foo: "bar" })
    })

    it("should handle errors and send 500", async () => {
        const fn = vi.fn().mockRejectedValue(new Error("fail"))
        const req = { params: {}, body: {} } as any
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any
        const handler = runExpressEndpoint(fn, "get")
        await handler(req, res)
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ message: "fail" })
    })
})
