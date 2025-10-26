import { describe, expect, it } from "vitest"

import { CustomError } from "./custom-error"

describe("CustomError", () => {
    it("should set statusCode and message", () => {
        const error = new CustomError("Not found", 404)
        expect(error.statusCode).toBe(404)
        expect(error.message).toBe("Not found")
    })

    it("should set optional code and details", () => {
        const error = new CustomError("Not found", 404, "NOT_FOUND", { id: 123 })
        expect(error.statusCode).toBe(404)
        expect(error.message).toBe("Not found")
        expect(error.code).toBe("NOT_FOUND")
        expect(error.details).toEqual({ id: 123 })
    })
})
