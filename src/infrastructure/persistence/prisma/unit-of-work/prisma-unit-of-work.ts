import { PrismaClient } from "@prisma/client"
import { UnitOfWork } from "@application/ports/output/unit-of-work"

/**
 * Prisma Implementation of Unit of Work Pattern
 * Manages database transactions using Prisma's transaction API
 */
export class PrismaUnitOfWork implements UnitOfWork {
    private transactionClient: PrismaClient | null = null

    constructor(private readonly prisma: PrismaClient) {}

    async begin(): Promise<void> {
        if (this.isInTransaction()) {
            throw new Error("Transaction already in progress")
        }
        // Prisma doesn't support explicit begin/commit
        // We'll use the interactive transaction pattern with execute()
    }

    async commit(): Promise<void> {
        // Handled automatically by Prisma's $transaction
        this.transactionClient = null
    }

    async rollback(): Promise<void> {
        // Handled automatically by Prisma's $transaction on error
        this.transactionClient = null
    }

    /**
     * Execute operations within a transaction
     * Prisma will automatically commit on success or rollback on error
     */
    async execute<T>(operation: () => Promise<T>): Promise<T> {
        try {
            const result = await this.prisma.$transaction(async (tx) => {
                this.transactionClient = tx as PrismaClient
                const operationResult = await operation()
                return operationResult
            })
            this.transactionClient = null
            return result
        } catch (error) {
            this.transactionClient = null
            throw error
        }
    }

    isInTransaction(): boolean {
        return this.transactionClient !== null
    }

    /**
     * Get the current transaction client or the main prisma client
     * Use this in repositories to ensure they use the transaction when active
     */
    getClient(): PrismaClient {
        return this.transactionClient || this.prisma
    }
}
