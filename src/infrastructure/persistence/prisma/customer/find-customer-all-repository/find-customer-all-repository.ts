import { Customer } from "@entities/customer/customer"
import { FindCustomerAllOutputPort } from "@application/ports/output/customer/find-customer-all-output-port"
import { prisma } from "@libraries/prisma/client"

export class PrismaFindCustomerAllRepository
    implements FindCustomerAllOutputPort
{
    async execute(): Promise<Customer[]> {
        return prisma.customer.findMany()
    }

    finish() {
        return prisma.$disconnect()
    }
}
