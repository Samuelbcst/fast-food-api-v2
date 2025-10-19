import { Customer } from "@entities/customer/customer"
import { UpdateCustomerOutputPort } from "@application/ports/output/customer/update-customer-output-port"
import { prisma } from "@libraries/prisma/client"

export class PrismaUpdateCustomerRepository
    implements UpdateCustomerOutputPort
{
    async execute(param: {
        id: Customer["id"]
        name?: Customer["name"]
        email?: Customer["email"]
        cpf?: Customer["cpf"]
    }): Promise<Customer | null> {
        const { id, name, email, cpf } = param
        // Find the customer first
        const customer = await prisma.customer.findUnique({ where: { id } })
        if (!customer) return null
        const data: Partial<Customer> = {}
        if (name !== undefined) data.name = name
        if (email !== undefined) data.email = email
        if (cpf !== undefined) data.cpf = cpf
        // Always update updatedAt
        data.updatedAt = new Date()
        const updated = await prisma.customer.update({ where: { id }, data })
        return updated
    }

    finish() {
        return prisma.$disconnect()
    }
}
