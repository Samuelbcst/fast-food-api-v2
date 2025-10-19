import { DeletePaymentInputPort } from "@application/ports/input/payment/delete-payment-input"
import { DeletePaymentOutputPort } from "@application/ports/output/payment/delete-payment-output-port"
import { DeletePaymentUseCase } from "."

export const makeDeletePaymentUseCase = (
    repository: DeletePaymentOutputPort
): DeletePaymentInputPort => new DeletePaymentUseCase(repository)
