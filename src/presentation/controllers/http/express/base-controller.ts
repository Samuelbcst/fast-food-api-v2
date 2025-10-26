import { Request, Response } from "express"
import { PresentationResponse } from "@presentation/presenters/presenter"

/**
 * Base Controller
 * Provides common functionality for all HTTP controllers
 */
export abstract class BaseController {
    /**
     * Send HTTP response based on presentation response
     */
    protected sendResponse<T>(
        res: Response,
        response: PresentationResponse<T>
    ): void {
        res.status(response.statusCode).json(response)
    }

    /**
     * Extract and parse request body
     */
    protected extractBody<T>(req: Request): T {
        return req.body as T
    }

    /**
     * Extract URL parameters
     */
    protected extractParams(req: Request): Record<string, string> {
        return req.params
    }

    /**
     * Extract query string parameters
     */
    protected extractQuery(req: Request): Record<string, any> {
        return req.query
    }

    /**
     * Extract a specific parameter by name
     */
    protected getParam(req: Request, name: string): string {
        return req.params[name]
    }

    /**
     * Extract a specific query parameter by name
     */
    protected getQuery(req: Request, name: string): string | undefined {
        return req.query[name] as string | undefined
    }
}
