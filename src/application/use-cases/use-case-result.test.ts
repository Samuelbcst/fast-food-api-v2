import { describe, expect, it } from "vitest"

import { CustomError } from "./custom-error"
import { UseCaseResult } from "./use-case-result"

describe("UseCaseResult", () => {
    it("should allow success result", () => {
        const result: UseCaseResult<string> = {
            success: true,
            result: "ok",
        }
        expect(result.success).toBe(true)
        expect(result.result).toBe("ok")
        expect(result.error).toBeUndefined()
    })

    it("should allow error result", () => {
        const error = new CustomError("fail", 400)
        const result: UseCaseResult = {
            success: false,
            result: null,
            error,
        }
        expect(result.success).toBe(false)
        expect(result.result).toBeNull()
        expect(result.error).toBe(error)
    })
})
