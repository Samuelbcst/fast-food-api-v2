import { UpdatePaymentInputPort } from "@application/ports/input/payment/update-payment-input"
import { UpdatePaymentOutputPort } from "@application/ports/output/payment/update-payment-output-port"
import { UpdatePaymentUseCase } from "."

export const makeUpdatePaymentUseCase = (
    repository: UpdatePaymentOutputPort
): UpdatePaymentInputPort => new UpdatePaymentUseCase(repository)
