import { FindPaymentByOrderIdInputPort } from "@application/ports/input/payment/find-payment-by-order-id-input"
import { FindPaymentByOrderIdOutputPort } from "@application/ports/output/payment/find-payment-by-order-id-output-port"

import { FindPaymentByOrderIdUseCase } from "."

export const makeFindPaymentByOrderIdUseCase = (
    repository: FindPaymentByOrderIdOutputPort
): FindPaymentByOrderIdInputPort => new FindPaymentByOrderIdUseCase(repository)
