import { Request } from "express"
import { makeGetOrderByStatusFactory } from "./make-order-get-by-status-dependencies"

export const getOrderByStatus = async (params: Request["params"]) => {
    const status = params.status
    if (!status) throw new Error("status is required")
    const useCase = await makeGetOrderByStatusFactory()
    const result = await useCase.execute({ status })
    await useCase.onFinish()
    return result
}
