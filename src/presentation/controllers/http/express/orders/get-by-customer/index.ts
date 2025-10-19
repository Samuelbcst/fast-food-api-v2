import { Request } from "express"
import { makeGetOrderByCustomerFactory } from "./make-order-get-by-customer-dependencies"

export const getOrderByCustomer = async (params: Request["params"]) => {
    const customerId = Number(params.customerId)
    if (isNaN(customerId)) throw new Error("customerId must be a number")
    const useCase = await makeGetOrderByCustomerFactory()
    const result = await useCase.execute({ customerId })
    await useCase.onFinish()
    return result
}
