import { FindPaymentAllInputPort } from "@application/ports/input/payment/find-payment-all-input"
import { FindPaymentAllOutputPort } from "@application/ports/output/payment/find-payment-all-output-port"
import { FindPaymentAllUseCase } from "."

export const makeFindPaymentAllUseCase = (
    repository: FindPaymentAllOutputPort
): FindPaymentAllInputPort => new FindPaymentAllUseCase(repository)
