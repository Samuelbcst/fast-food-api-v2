import { Request } from "express"

import { makeGetCustomerByIdFactory } from "./make-customer-get-by-id-dependencies"

export const getCustomerById = async (params: Request["params"]) => {
    const id = Number(params.id)
    if (isNaN(id)) throw new Error("Id must be a number")
    const useCase = await makeGetCustomerByIdFactory()
    const result = await useCase.execute({ id })
    await useCase.onFinish()

    return result
}
