import { beforeEach, describe, expect, it, vi } from "vitest"

import { PrismaCreateCustomerRepository } from "./create-customer-repository"

// Mock the CustomerModel import from the correct path used in create-customer-repository.ts
vi.mock("../model", () => ({
    CustomerModel: {
        create: vi.fn(),
    },
}))

const mockCustomer = {
    name: "customer",
    email: "customer@email.com",
    cpf: "12345678900",
}

describe("PrismaCreateCustomerRepository", () => {
    let repository: any
    let ormRepo: any
    let CustomerModel: any

    beforeEach(async () => {
        ormRepo = {
            manager: { connection: { destroy: vi.fn() } },
        }
        // Dynamically import the mocked module
        CustomerModel = (await vi.importMock("../model")).CustomerModel
        repository = new PrismaCreateCustomerRepository()
    })

    it("should create and save a customer", async () => {
        const save = vi.fn().mockResolvedValue(undefined)
        CustomerModel.create.mockReturnValue({ ...mockCustomer, save })
        await repository.create(mockCustomer)
        expect(CustomerModel.create).toHaveBeenCalledWith(mockCustomer)
        expect(save).toHaveBeenCalled()
    })

    it("should call destroy on finish", async () => {
        await repository.finish()
        expect(ormRepo.manager.connection.destroy).toHaveBeenCalled()
    })
})
