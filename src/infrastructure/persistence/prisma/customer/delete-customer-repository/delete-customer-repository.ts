import { Customer } from "@entities/customer/customer"
import { DeleteCustomerOutputPort } from "@application/ports/output/customer/delete-customer-output-port"
import { prisma } from "@libraries/prisma/client"

export class PrismaDeleteCustomerRepository
    implements DeleteCustomerOutputPort
{
    async execute(id: number): Promise<Customer | null> {
        const customer = await prisma.customer.findUnique({ where: { id } })
        if (!customer) return null
        await prisma.customer.delete({ where: { id } })
        return new Customer(
            customer.id.toString(),
            customer.name,
            customer.email,
            customer.cpf,
            false
        )
    }

    finish() {
        return prisma.$disconnect()
    }
}
