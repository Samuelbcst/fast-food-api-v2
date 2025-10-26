import { NextFunction, Request, Response } from "express"

/**
 * Request Logger Middleware
 *
 * Logs all incoming HTTP requests and their responses.
 * Useful for debugging and monitoring.
 *
 * Logs:
 * - HTTP method
 * - Request path
 * - Response status code
 * - Response time (duration)
 * - Timestamp
 *
 * In production, you might want to:
 * - Send logs to a service (DataDog, CloudWatch, etc.)
 * - Add request IDs for tracing
 * - Log request body (carefully, avoiding sensitive data)
 * - Add user information if authenticated
 */
export function requestLogger(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const start = Date.now()

    // Log when response finishes
    res.on("finish", () => {
        const duration = Date.now() - start
        const timestamp = new Date().toISOString()

        // Choose emoji based on status code
        let emoji = "✅"
        if (res.statusCode >= 400 && res.statusCode < 500) {
            emoji = "⚠️"
        } else if (res.statusCode >= 500) {
            emoji = "❌"
        }

        // Log in a readable format
        console.log(
            `${emoji} [${timestamp}] ${req.method} ${req.path} → ${res.statusCode} (${duration}ms)`
        )

        // In production, send to logging service:
        // logger.info({
        //     method: req.method,
        //     path: req.path,
        //     statusCode: res.statusCode,
        //     duration: `${duration}ms`,
        //     timestamp,
        //     ip: req.ip,
        //     userAgent: req.get('user-agent'),
        // })
    })

    next()
}
