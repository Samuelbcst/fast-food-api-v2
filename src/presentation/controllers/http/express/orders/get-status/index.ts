import { UseCaseResult } from "@application/use-cases/use-case-result"
import { Request } from "express"

import { makeGetOrderByIdFactory } from "../get-by-id/make-order-get-by-id-dependencies"

interface OrderStatusResponse {
    status: string
}

export const getOrderStatus = async (
    params: Request["params"]
): Promise<UseCaseResult<OrderStatusResponse>> => {
    const id = Number(params.id)
    if (Number.isNaN(id)) {
        throw new Error("id must be a number")
    }

    const useCase = await makeGetOrderByIdFactory()
    const orderResult = await useCase.execute({ id })
    await useCase.onFinish()

    if (!orderResult.success || !orderResult.result) {
        return {
            success: false,
            result: null,
            error: orderResult.error,
        }
    }

    return {
        success: true,
        result: { status: orderResult.result.status },
    }
}
