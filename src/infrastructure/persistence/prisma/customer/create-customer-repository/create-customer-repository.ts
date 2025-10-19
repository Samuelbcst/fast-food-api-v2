import { BaseEntity } from "@entities/base-entity"
import { Customer } from "@entities/customer/customer"
import { prisma } from "@libraries/prisma/client"
import { CreateCustomerOutputPort } from "@application/ports/output/customer/create-customer-output-port"

export class PrismaCreateCustomerRepository
    implements CreateCustomerOutputPort
{
    async create({ name, email, cpf }: Omit<Customer, keyof BaseEntity>) {
        const customer = await prisma.customer.create({
            data: { name, email, cpf },
        })
        return customer
    }

    finish() {
        return prisma.$disconnect()
    }
}
