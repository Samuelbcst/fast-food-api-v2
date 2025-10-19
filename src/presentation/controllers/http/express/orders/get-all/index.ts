import { makeGetOrderAllFactory } from "./make-order-get-all-dependencies"

export const getOrderAll = async () => {
    const useCase = await makeGetOrderAllFactory()
    const result = await useCase.execute()
    await useCase.onFinish()
    return result
}
