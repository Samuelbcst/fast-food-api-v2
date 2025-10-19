import { CustomError } from "./custom-error"

export interface UseCaseResult<T extends unknown = unknown> {
    success: boolean
    result: T | null
    error?: CustomError
}
