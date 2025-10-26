import { makeFindOrderByCustomerOutputPort } from "@persistence/prisma/order/find-order-by-customer-repository/make-find-order-by-customer-repository"
import { makeFindOrderByCustomerUseCase } from "@application/use-cases/order/find-order-by-customer/make-find-order-by-customer-use-case"

export const makeGetOrderByCustomerFactory = async () => {
    const repository = await makeFindOrderByCustomerOutputPort()
    const useCase = makeFindOrderByCustomerUseCase(repository)
    return useCase
}
