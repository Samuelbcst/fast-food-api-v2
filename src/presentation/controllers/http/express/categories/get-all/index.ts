import { makeGetCategoryAllFactory } from "./make-category-get-all-dependencies"

export const getCategoryAll = async () => {
    const useCase = await makeGetCategoryAllFactory()
    const result = await useCase.execute()
    await useCase.onFinish()
    return result
}
