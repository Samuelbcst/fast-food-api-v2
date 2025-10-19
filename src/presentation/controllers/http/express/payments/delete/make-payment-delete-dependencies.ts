import { makeDeletePaymentRepository } from "@persistence/prisma/payment/delete-payment-repository/make-delete-payment-repository"
import { makeDeletePaymentUseCase } from "@use-cases/payment/delete-payment/make-delete-payment-use-case"

export const makeDeletePaymentFactory = async () => {
    const deletePaymentRepository = await makeDeletePaymentRepository()
    const useCase = makeDeletePaymentUseCase(deletePaymentRepository)
    return useCase
}
