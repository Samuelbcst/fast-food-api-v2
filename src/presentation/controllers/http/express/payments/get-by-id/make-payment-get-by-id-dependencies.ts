import { makeFindPaymentByIdRepository } from "@persistence/prisma/payment/find-payment-by-id-repository/make-find-payment-by-id-repository"
import { makeFindPaymentByIdUseCase } from "@use-cases/payment/find-payment-by-id/make-find-payment-by-id-use-case"

export const makeGetPaymentByIdFactory = async () => {
    const repository = await makeFindPaymentByIdRepository()
    const useCase = makeFindPaymentByIdUseCase(repository)
    return useCase
}
