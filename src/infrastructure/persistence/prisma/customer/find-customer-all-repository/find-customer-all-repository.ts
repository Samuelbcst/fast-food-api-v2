import { Customer } from "@entities/customer/customer"
import { FindCustomerAllOutputPort } from "@application/ports/output/customer/find-customer-all-output-port"
import { prisma } from "@libraries/prisma/client"

export class PrismaFindCustomerAllRepository
    implements FindCustomerAllOutputPort
{
    async execute(): Promise<Customer[]> {
        const rows = await prisma.customer.findMany()
        return rows.map((r) =>
            new Customer(r.id.toString(), r.name, r.email, r.cpf, false)
        )
    }

    finish() {
        return prisma.$disconnect()
    }
}
