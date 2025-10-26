/**
 * Unit of Work Pattern
 * Manages transactions across multiple repository operations
 * Ensures atomicity: either all operations succeed or all fail
 */
export interface UnitOfWork {
    /**
     * Begin a new transaction
     */
    begin(): Promise<void>

    /**
     * Commit the current transaction
     * Makes all changes permanent
     */
    commit(): Promise<void>

    /**
     * Rollback the current transaction
     * Undoes all changes
     */
    rollback(): Promise<void>

    /**
     * Execute an operation within a transaction
     * Automatically commits on success, rolls back on error
     *
     * @param operation - The async function to execute within the transaction
     * @returns The result of the operation
     */
    execute<T>(operation: () => Promise<T>): Promise<T>

    /**
     * Check if currently in a transaction
     */
    isInTransaction(): boolean
}
