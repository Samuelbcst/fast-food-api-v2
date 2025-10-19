import { makeFindOrderByCustomerRepository } from "@persistence/prisma/order/find-order-by-customer-repository/make-find-order-by-customer-repository"
import { makeFindOrderByCustomerUseCase } from "@use-cases/order/find-order-by-customer/make-find-order-by-customer-use-case"

export const makeGetOrderByCustomerFactory = async () => {
    const repository = await makeFindOrderByCustomerRepository()
    const useCase = makeFindOrderByCustomerUseCase(repository)
    return useCase
}
