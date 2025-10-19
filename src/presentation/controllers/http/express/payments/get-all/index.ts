import { makeGetPaymentAllFactory } from "./make-payment-get-all-dependencies"

export const getPaymentAll = async () => {
    const useCase = await makeGetPaymentAllFactory()
    const result = await useCase.execute()
    await useCase.onFinish()
    return result
}
