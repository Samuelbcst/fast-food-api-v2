import { makeGetProductAllFactory } from "./make-product-get-all-dependencies"

export const getProductAll = async () => {
    const useCase = await makeGetProductAllFactory()
    const result = await useCase.execute()
    await useCase.onFinish()
    return result
}
