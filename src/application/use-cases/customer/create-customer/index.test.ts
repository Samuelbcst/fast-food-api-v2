import type { CreateCustomerOutputPort } from "@application/ports/output/customer/create-customer-output-port"
import { CustomError } from "@application/use-cases/custom-error"
import { beforeEach, describe, expect, it, vi } from "vitest"
import type { UUIDService } from "@domain/services/UUIDService"
import type { EventDispatcher } from "@domain/events/event-dispatcher"

import { CreateCustomerUseCase } from "."

describe("CreateCustomerUseCase", () => {
    let repository: CreateCustomerOutputPort
    let uuidService: UUIDService
    let eventDispatcher: EventDispatcher
    let useCase: CreateCustomerUseCase
    const input = {
        name: "Test",
        email: "test@example.com",
        cpf: "12345678900",
    }
    const customer = {
        id: "uuid-123",
        ...input,
        createdAt: new Date(),
        updatedAt: new Date(),
    }

    beforeEach(() => {
        repository = {
            create: vi.fn().mockResolvedValue(customer),
            finish: vi.fn().mockResolvedValue(undefined),
        }
        uuidService = {
            generate: vi.fn().mockReturnValue("uuid-123"),
        }
        eventDispatcher = {
            dispatch: vi.fn().mockResolvedValue(undefined),
            dispatchAll: vi.fn().mockResolvedValue(undefined),
            register: vi.fn(),
        }
        useCase = new CreateCustomerUseCase(repository, uuidService, eventDispatcher)
    })

    it("should return success true when customer is created", async () => {
        const result = await useCase.execute(input)
        expect(result.success).toBe(true)
        expect(result.result).toEqual(customer)
        expect(repository.create).toHaveBeenCalledWith(input)
    })

    it("should return success false and CustomError on failure", async () => {
        const errorMsg = "fail"
        repository.create = vi.fn().mockRejectedValue(new Error(errorMsg))
        useCase = new CreateCustomerUseCase(repository, uuidService, eventDispatcher)
        const result = await useCase.execute(input)
        expect(result.success).toBe(false)
        expect(result.error).toBeInstanceOf(CustomError)
        expect(result.error?.message).toBe(errorMsg)
    })

    it("should call finish on repository when onFinish is called", async () => {
        await useCase.onFinish()
        expect(repository.finish).toHaveBeenCalled()
    })
})
