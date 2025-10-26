import { makeFindPaymentByIdOutputPort } from "@persistence/prisma/payment/find-payment-by-id-repository/make-find-payment-by-id-repository"
import { makeFindPaymentByIdUseCase } from "@application/use-cases/payment/find-payment-by-id/make-find-payment-by-id-use-case"

export const makeGetPaymentByIdFactory = async () => {
    const repository = await makeFindPaymentByIdOutputPort()
    const useCase = makeFindPaymentByIdUseCase(repository)
    return useCase
}
