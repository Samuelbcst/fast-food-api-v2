import { FindPaymentByIdInputPort } from "@application/ports/input/payment/find-payment-by-id-input"
import { FindPaymentByIdOutputPort } from "@application/ports/output/payment/find-payment-by-id-output-port"
import { FindPaymentByIdUseCase } from "."

export const makeFindPaymentByIdUseCase = (
    repository: FindPaymentByIdOutputPort
): FindPaymentByIdInputPort => new FindPaymentByIdUseCase(repository)
