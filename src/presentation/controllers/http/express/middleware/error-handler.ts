import { Prisma } from "@prisma/client"
import { NextFunction, Request, Response } from "express"
import { ZodError } from "zod"
import { CustomError } from "../../../../../application/use-cases/custom-error"

/**
 * Standard Error Response Format
 *
 * All errors returned to clients follow this structure.
 */
export interface ErrorResponse {
    error: {
        code: string
        message: string
        details?: any
        timestamp: string
        path: string
    }
}

/**
 * Error Handler Middleware
 *
 * This is the central error handling for the entire application.
 * It catches all errors thrown in controllers and use cases,
 * converts them to appropriate HTTP responses.
 *
 * IMPORTANT: This must be the LAST middleware in the Express app!
 *
 * Benefits:
 * - Consistent error responses
 * - Automatic logging
 * - Production-safe error messages
 * - Proper HTTP status codes
 * - Clean controller code (just throw errors!)
 */
export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
): void {
    // Log all errors (in production, send to monitoring service)
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    console.error("❌ Error caught by middleware:")
    console.error("Path:", req.method, req.path)
    console.error("Error:", err.name, "-", err.message)
    if (err.stack) {
        console.error("Stack:", err.stack)
    }
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

    // Handle different error types

    // 1. Custom Application Errors (our error classes)
    if (err instanceof CustomError) {
        const response: ErrorResponse = {
            error: {
                code: err.code || "CUSTOM_ERROR",
                message: err.message,
                details: err.details,
                timestamp: new Date().toISOString(),
                path: req.path,
            },
        }
        res.status(err.statusCode).json(response)
        return
    }

    // 2. Zod Validation Errors (from input validation)
    if (err instanceof ZodError) {
        const response: ErrorResponse = {
            error: {
                code: "VALIDATION_ERROR",
                message: "Input validation failed",
                details: err.errors.map((e) => ({
                    field: e.path.join("."),
                    message: e.message,
                })),
                timestamp: new Date().toISOString(),
                path: req.path,
            },
        }
        res.status(400).json(response)
        return
    }

    // 3. Prisma Database Errors
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        let statusCode = 400
        let message = "Database error"
        let code = "DATABASE_ERROR"

        // Map Prisma error codes to meaningful messages
        switch (err.code) {
            case "P2002":
                // Unique constraint violation
                statusCode = 409
                message = "A record with this value already exists"
                code = "DUPLICATE_ENTRY"
                break
            case "P2025":
                // Record not found
                statusCode = 404
                message = "Record not found"
                code = "NOT_FOUND"
                break
            case "P2003":
                // Foreign key constraint failed
                statusCode = 400
                message = "Invalid reference to related record"
                code = "INVALID_REFERENCE"
                break
            case "P2014":
                // Required relation violation
                statusCode = 400
                message = "The change would violate a required relation"
                code = "RELATION_VIOLATION"
                break
        }

        const response: ErrorResponse = {
            error: {
                code,
                message,
                details:
                    process.env.NODE_ENV === "production"
                        ? undefined
                        : { prismaCode: err.code, meta: err.meta },
                timestamp: new Date().toISOString(),
                path: req.path,
            },
        }
        res.status(statusCode).json(response)
        return
    }

    // 4. Prisma Client Initialization Errors
    if (err instanceof Prisma.PrismaClientInitializationError) {
        const response: ErrorResponse = {
            error: {
                code: "DATABASE_CONNECTION_ERROR",
                message: "Failed to connect to database",
                details:
                    process.env.NODE_ENV === "production"
                        ? undefined
                        : err.message,
                timestamp: new Date().toISOString(),
                path: req.path,
            },
        }
        res.status(503).json(response)
        return
    }

    // 5. Default/Unexpected Errors (500)
    const response: ErrorResponse = {
        error: {
            code: "INTERNAL_SERVER_ERROR",
            message:
                process.env.NODE_ENV === "production"
                    ? "An unexpected error occurred"
                    : err.message,
            details:
                process.env.NODE_ENV === "production"
                    ? undefined
                    : {
                          name: err.name,
                          stack: err.stack,
                      },
            timestamp: new Date().toISOString(),
            path: req.path,
        },
    }
    res.status(500).json(response)
}
