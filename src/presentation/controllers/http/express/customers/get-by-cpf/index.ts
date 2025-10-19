import { Request } from "express"

import { makeGetCustomerByCpfFactory } from "./make-customer-get-by-cpf-dependencies"

export const getCustomerByCpf = async (params: Request["params"]) => {
    const { cpf } = params
    if (!cpf) throw new Error("CPF is required")
    const useCase = await makeGetCustomerByCpfFactory()
    const result = await useCase.execute({ cpf })
    await useCase.onFinish()
    return result
}
