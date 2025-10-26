import { PrismaClient } from "@prisma/client"
import { prisma } from "@libraries/prisma/client"
import { PrismaUnitOfWork } from "./prisma-unit-of-work"

/**
 * Factory function to create a Prisma UnitOfWork instance
 * @param client - Optional Prisma client (uses default if not provided)
 */
export function makePrismaUnitOfWork(client?: PrismaClient): PrismaUnitOfWork {
    return new PrismaUnitOfWork(client || prisma)
}
