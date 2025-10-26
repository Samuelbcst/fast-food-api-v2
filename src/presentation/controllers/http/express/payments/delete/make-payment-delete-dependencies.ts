import { makeDeletePaymentOutputPort } from "@persistence/prisma/payment/delete-payment-repository/make-delete-payment-repository"
import { makeDeletePaymentUseCase } from "@application/use-cases/payment/delete-payment/make-delete-payment-use-case"

export const makeDeletePaymentFactory = async () => {
    const deletePaymentRepository = await makeDeletePaymentOutputPort()
    const useCase = makeDeletePaymentUseCase(deletePaymentRepository)
    return useCase
}
