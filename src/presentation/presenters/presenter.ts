import { UseCaseResult } from "@application/use-cases/use-case-result"

/**
 * Base Presenter interface
 * Presenters transform use case results into presentation-ready formats
 */
export interface Presenter<TInput, TOutput> {
    present(result: UseCaseResult<TInput>): TOutput
}

/**
 * Standard error response structure
 */
export interface ErrorResponse {
    error: string
    message: string
    details?: any
    statusCode: number
}

/**
 * Standard success response structure
 */
export interface SuccessResponse<T> {
    data: T
    statusCode: number
}

/**
 * Union type for all presentation responses
 */
export type PresentationResponse<T> = SuccessResponse<T> | ErrorResponse
