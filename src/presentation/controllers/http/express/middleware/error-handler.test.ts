import { describe, it, expect, vi, beforeEach } from "vitest"
import { Request, Response, NextFunction } from "express"
import { ZodError } from "zod"
import { Prisma } from "@prisma/client"
import {
    CustomError,
    NotFoundError,
    ValidationError,
    ConflictError,
} from "../../../../../application/use-cases/custom-error"
import { errorHandler } from "./error-handler"

/**
 * Error Handler Middleware Tests
 *
 * These tests demonstrate how the error middleware handles different error types.
 */
describe("Error Handler Middleware", () => {
    let mockReq: Partial<Request>
    let mockRes: Partial<Response>
    let mockNext: NextFunction
    let jsonMock: ReturnType<typeof vi.fn>
    let statusMock: ReturnType<typeof vi.fn>

    beforeEach(() => {
        // Mock console.error to avoid cluttering test output
        vi.spyOn(console, "error").mockImplementation(() => {})

        jsonMock = vi.fn()
        statusMock = vi.fn().mockReturnValue({ json: jsonMock })

        mockReq = {
            path: "/api/v1/test",
            method: "POST",
        }

        mockRes = {
            status: statusMock,
            json: jsonMock,
        }

        mockNext = vi.fn()
    })

    it("should handle NotFoundError with 404 status", () => {
        const error = new NotFoundError("Resource not found")

        errorHandler(
            error,
            mockReq as Request,
            mockRes as Response,
            mockNext
        )

        expect(statusMock).toHaveBeenCalledWith(404)
        expect(jsonMock).toHaveBeenCalledWith(
            expect.objectContaining({
                error: expect.objectContaining({
                    code: "NOT_FOUND",
                    message: "Resource not found",
                }),
            })
        )
    })

    it("should handle ValidationError with 400 status", () => {
        const error = new ValidationError("Invalid input", {
            field: "name",
        })

        errorHandler(
            error,
            mockReq as Request,
            mockRes as Response,
            mockNext
        )

        expect(statusMock).toHaveBeenCalledWith(400)
        expect(jsonMock).toHaveBeenCalledWith(
            expect.objectContaining({
                error: expect.objectContaining({
                    code: "VALIDATION_ERROR",
                    message: "Invalid input",
                    details: { field: "name" },
                }),
            })
        )
    })

    it("should handle ConflictError with 409 status", () => {
        const error = new ConflictError("Resource already exists")

        errorHandler(
            error,
            mockReq as Request,
            mockRes as Response,
            mockNext
        )

        expect(statusMock).toHaveBeenCalledWith(409)
        expect(jsonMock).toHaveBeenCalledWith(
            expect.objectContaining({
                error: expect.objectContaining({
                    code: "CONFLICT",
                    message: "Resource already exists",
                }),
            })
        )
    })

    it("should handle generic Error with 500 status", () => {
        const error = new Error("Unexpected error")

        errorHandler(
            error,
            mockReq as Request,
            mockRes as Response,
            mockNext
        )

        expect(statusMock).toHaveBeenCalledWith(500)
        expect(jsonMock).toHaveBeenCalledWith(
            expect.objectContaining({
                error: expect.objectContaining({
                    code: "INTERNAL_SERVER_ERROR",
                }),
            })
        )
    })

    it("should include timestamp and path in error response", () => {
        const error = new NotFoundError("Test error")

        errorHandler(
            error,
            mockReq as Request,
            mockRes as Response,
            mockNext
        )

        const callArgs = jsonMock.mock.calls[0][0]
        expect(callArgs.error.timestamp).toBeDefined()
        expect(callArgs.error.path).toBe("/api/v1/test")
    })

    it("should log errors to console", () => {
        const error = new NotFoundError("Test error")
        const consoleErrorSpy = vi.spyOn(console, "error")

        errorHandler(
            error,
            mockReq as Request,
            mockRes as Response,
            mockNext
        )

        expect(consoleErrorSpy).toHaveBeenCalled()
    })
})
