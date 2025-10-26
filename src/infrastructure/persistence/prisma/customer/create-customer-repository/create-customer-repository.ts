import { Customer } from "@entities/customer/customer"
import { prisma } from "@libraries/prisma/client"
import { CreateCustomerOutputPort } from "@application/ports/output/customer/create-customer-output-port"

export class PrismaCreateCustomerRepository implements CreateCustomerOutputPort {
    async create(customer: Customer): Promise<Customer> {
        // Persist minimal fields to the DB. We intentionally do not write the domain UUID
        // into the numeric DB id (project uses numeric ids in Prisma schema).
        await prisma.customer.create({
            data: {
                name: customer.name,
                email: customer.email,
                cpf: customer.cpf,
            },
        })

        // Return the original domain entity to preserve domain events.
        return customer
    }

    async finish() {
        await prisma.$disconnect()
    }
}
