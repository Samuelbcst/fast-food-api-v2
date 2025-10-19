import { Customer } from "@entities/customer/customer"
import { FindCustomerByIdOutputPort } from "@application/ports/output/customer/find-customer-by-id-output-port"
import { prisma } from "@libraries/prisma/client"

export class PrismaFindCustomerByIdRepository
    implements FindCustomerByIdOutputPort
{
    async execute(id: Customer["id"]): Promise<Customer | null> {
        return prisma.customer.findUnique({ where: { id } })
    }

    finish() {
        return prisma.$disconnect()
    }
}
