import { CreatePaymentInputPort } from "@application/ports/input/payment/create-payment-input"
import { FindOrderByIdOutputPort } from "@application/ports/output/order/find-order-by-id-output-port"
import { CreatePaymentOutputPort } from "@application/ports/output/payment/create-payment-output-port"
import { CreatePaymentUseCase } from "."

export const makeCreatePaymentUseCase = (
    paymentRepository: CreatePaymentOutputPort,
    orderRepository: FindOrderByIdOutputPort
): CreatePaymentInputPort =>
    new CreatePaymentUseCase(paymentRepository, orderRepository)
