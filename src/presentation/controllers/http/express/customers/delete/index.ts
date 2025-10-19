import { Request } from "express"

import { makeDeleteCustomerFactory } from "./make-customer-delete-dependencies"

export const deleteCustomer = async (params: Request["params"]) => {
    const id = Number(params.id)
    if (isNaN(id)) throw new Error("Id must be a number")

    const useCase = await makeDeleteCustomerFactory()
    const result = await useCase.execute({ id })
    await useCase.onFinish()

    return result
}
