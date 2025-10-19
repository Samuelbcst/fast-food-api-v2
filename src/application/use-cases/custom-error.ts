export class CustomError extends Error {
    constructor(
        public readonly code: 400 | 404 | 500,
        message?: string
    ) {
        super(message)
    }
}
