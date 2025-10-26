import { makeFindPaymentAllOutputPort } from "@persistence/prisma/payment/find-payment-all-repository/make-find-payment-all-repository"
import { makeFindPaymentAllUseCase } from "@application/use-cases/payment/find-payment-all/make-find-payment-all-use-case"

export const makeGetPaymentAllFactory = async () => {
    const repository = await makeFindPaymentAllOutputPort()
    const useCase = makeFindPaymentAllUseCase(repository)
    return useCase
}
