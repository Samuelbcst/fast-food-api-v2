import { Customer } from "@entities/customer/customer"
import { FindCustomerByCpfOutputPort } from "@application/ports/output/customer/find-customer-by-cpf-output-port"
import { prisma } from "@libraries/prisma/client"

export class PrismaFindCustomerByCpfRepository
    implements FindCustomerByCpfOutputPort
{
    async execute(cpf: string): Promise<Customer | null> {
        return prisma.customer.findFirst({ where: { cpf } })
    }

    finish() {
        return prisma.$disconnect()
    }
}
