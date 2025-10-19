import { makeGetOrderItemAllFactory } from "./make-order-item-get-all-dependencies"

export const getOrderItemAll = async () => {
    const useCase = await makeGetOrderItemAllFactory()
    const result = await useCase.execute()
    await useCase.onFinish()
    return result
}
