/**
 * Base Custom Error Class
 *
 * All application errors should extend this class.
 * This ensures consistent error handling across the application.
 */
export class CustomError extends Error {
    constructor(
        message: string,
        public readonly statusCode: number = 400,
        public readonly code?: string,
        public readonly details?: any
    ) {
        super(message)
        this.name = "CustomError"
        // Maintains proper stack trace for where error was thrown
        Object.setPrototypeOf(this, CustomError.prototype)
    }
}

/**
 * Not Found Error (404)
 *
 * Use when a requested resource doesn't exist.
 * Example: Category with ID not found, Product not found, etc.
 */
export class NotFoundError extends CustomError {
    constructor(message: string, details?: any) {
        super(message, 404, "NOT_FOUND", details)
        this.name = "NotFoundError"
    }
}

/**
 * Validation Error (400)
 *
 * Use when input validation fails.
 * Example: Invalid email format, missing required fields, etc.
 */
export class ValidationError extends CustomError {
    constructor(message: string, details?: any) {
        super(message, 400, "VALIDATION_ERROR", details)
        this.name = "ValidationError"
    }
}

/**
 * Unauthorized Error (401)
 *
 * Use when authentication is required but not provided.
 */
export class UnauthorizedError extends CustomError {
    constructor(message: string = "Authentication required", details?: any) {
        super(message, 401, "UNAUTHORIZED", details)
        this.name = "UnauthorizedError"
    }
}

/**
 * Forbidden Error (403)
 *
 * Use when user is authenticated but doesn't have permission.
 */
export class ForbiddenError extends CustomError {
    constructor(message: string = "Access forbidden", details?: any) {
        super(message, 403, "FORBIDDEN", details)
        this.name = "ForbiddenError"
    }
}

/**
 * Conflict Error (409)
 *
 * Use when the request conflicts with existing data.
 * Example: Duplicate category name, email already exists, etc.
 */
export class ConflictError extends CustomError {
    constructor(message: string, details?: any) {
        super(message, 409, "CONFLICT", details)
        this.name = "ConflictError"
    }
}

/**
 * Internal Server Error (500)
 *
 * Use for unexpected errors that shouldn't be exposed to users.
 */
export class InternalServerError extends CustomError {
    constructor(message: string = "An unexpected error occurred", details?: any) {
        super(message, 500, "INTERNAL_SERVER_ERROR", details)
        this.name = "InternalServerError"
    }
}
