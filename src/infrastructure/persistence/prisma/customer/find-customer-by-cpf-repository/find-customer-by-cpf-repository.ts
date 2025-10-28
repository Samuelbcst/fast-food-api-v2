import { Customer } from "@entities/customer/customer"
import { FindCustomerByCpfOutputPort } from "@application/ports/output/customer/find-customer-by-cpf-output-port"
import { prisma } from "@libraries/prisma/client"

export class PrismaFindCustomerByCpfRepository
    implements FindCustomerByCpfOutputPort
{
    async execute(cpf: string): Promise<Customer | null> {
        const customer = await prisma.customer.findFirst({ where: { cpf } })

        if (!customer) {
            return null
        }

        // Reconstruct rich domain Customer entity from DB
        return new Customer(
            customer.id.toString(),
            customer.name,
            customer.email,
            customer.cpf,
            false // Don't raise events on reconstruction from DB
        )
    }

    finish() {
        return prisma.$disconnect()
    }
}
