import { makeGetCustomerAllFactory } from "./make-customer-get-all-dependencies"

export const getCustomerAll = async () => {
    const useCase = await makeGetCustomerAllFactory()
    const result = await useCase.execute()
    await useCase.onFinish()
    return result
}
