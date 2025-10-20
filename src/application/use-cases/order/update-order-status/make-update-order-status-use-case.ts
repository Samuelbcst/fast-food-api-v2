import { UpdateOrderStatusInputPort } from "@application/ports/input/order/update-order-status-input"
import { FindOrderByIdOutputPort } from "@application/ports/output/order/find-order-by-id-output-port"
import { UpdateOrderStatusOutputPort } from "@application/ports/output/order/update-order-status-output-port/index"
import { FindPaymentByOrderIdOutputPort } from "@application/ports/output/payment/find-payment-by-order-id-output-port"
import { UpdateOrderStatusUseCase } from "."

export const makeUpdateOrderStatusUseCase = (
    repository: UpdateOrderStatusOutputPort,
    findOrderByIdRepository: FindOrderByIdOutputPort,
    findPaymentByOrderIdRepository: FindPaymentByOrderIdOutputPort
): UpdateOrderStatusInputPort =>
    new UpdateOrderStatusUseCase(
        repository,
        findOrderByIdRepository,
        findPaymentByOrderIdRepository
    )
