import { makeUpdatePaymentRepository } from "@persistence/prisma/payment/update-payment-repository/make-update-payment-repository"
import { makeUpdatePaymentUseCase } from "@use-cases/payment/update-payment/make-update-payment-use-case"

export const makeUpdatePaymentFactory = async () => {
    const updatePaymentRepository = await makeUpdatePaymentRepository()
    const useCase = makeUpdatePaymentUseCase(updatePaymentRepository)
    return useCase
}
