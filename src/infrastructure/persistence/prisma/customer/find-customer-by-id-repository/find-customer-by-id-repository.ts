import { Customer } from "@entities/customer/customer"
import { FindCustomerByIdOutputPort } from "@application/ports/output/customer/find-customer-by-id-output-port"
import { prisma } from "@libraries/prisma/client"

export class PrismaFindCustomerByIdRepository implements FindCustomerByIdOutputPort {
    async execute(id: number): Promise<Customer | null> {
    const customer = await prisma.customer.findUnique({ where: { id } })
        if (!customer) return null

        // Reconstruct domain entity (raiseEvent = false since this is from DB)
        return new Customer(customer.id.toString(), customer.name, customer.email, customer.cpf, false)
    }

    async finish() {
        await prisma.$disconnect()
    }
}
