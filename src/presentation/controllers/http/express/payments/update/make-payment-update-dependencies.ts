import { makeUpdatePaymentOutputPort } from "@persistence/prisma/payment/update-payment-repository/make-update-payment-repository"
import { makeUpdatePaymentUseCase } from "@application/use-cases/payment/update-payment/make-update-payment-use-case"

export const makeUpdatePaymentFactory = async () => {
    const updatePaymentRepository = await makeUpdatePaymentOutputPort()
    const useCase = makeUpdatePaymentUseCase(updatePaymentRepository)
    return useCase
}
