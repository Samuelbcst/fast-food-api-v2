import { describe, expect, it } from "vitest"

import { CustomError } from "./custom-error"

describe("CustomError", () => {
    it("should set code and message", () => {
        const error = new CustomError(404, "Not found")
        expect(error.code).toBe(404)
        expect(error.message).toBe("Not found")
    })
})
