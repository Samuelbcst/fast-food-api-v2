import { Router } from "express"
import { runExpressEndpoint } from "../generic/run-express-endpoint"
import { createPayment } from "./create"
import { deletePayment } from "./delete"
import { getPaymentAll } from "./get-all"
import { getPaymentById } from "./get-by-id"
import { getPaymentByOrder } from "./get-by-order"
import { updatePayment } from "./update"
import { handlePaymentWebhook } from "./webhook"

const paymentRouter = Router()

/**
 * @openapi
 * tags:
 *   - name: payment
 *     description: Operations about payments
 */

/**
 * @openapi
 * /payments:
 *   get:
 *     tags:
 *       - payment
 *     summary: Get all payments
 *     responses:
 *       200:
 *         description: A list of payments.
 */
paymentRouter.get("/", runExpressEndpoint(getPaymentAll, "get"))

/**
 * @openapi
 * /payments/order/{orderId}:
 *   get:
 *     tags:
 *       - payment
 *     summary: Get payment by order ID
 *     parameters:
 *        - name: orderId
 *          in: path
 *          required: true
 *          schema:
 *              type: number
 *     responses:
 *          200:
 *              description: A payment associated with the order.
 *          404:
 *              description: Payment not found for this order.
 */
paymentRouter.get(
    "/order/:orderId",
    runExpressEndpoint(getPaymentByOrder, "get")
)

/**
 * @openapi
 * /payments/{id}:
 *   get:
 *     tags:
 *       - payment
 *     summary: Get payment by ID
 *     parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *              type: number
 *     responses:
 *          200:
 *              description: A payment.
 *          404:
 *              description: Payment not found.
 */
paymentRouter.get("/:id", runExpressEndpoint(getPaymentById, "get"))

/**
 * @openapi
 * /payments:
 *   post:
 *     tags:
 *       - payment
 *     summary: Create a new payment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: number
 *                 required: true
 *               amount:
 *                 type: number
 *                 description: Optional override for the order total
 *     responses:
 *       201:
 *         description: Payment created.
 *       400:
 *         description: Invalid input.
 */
paymentRouter.post("/", runExpressEndpoint(createPayment, "post"))

/**
 * @openapi
 * /payments/webhook:
 *   post:
 *     tags:
 *       - payment
 *     summary: Handle payment confirmation webhook
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [APPROVED, REJECTED]
 *               paidAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Webhook processed successfully.
 *       400:
 *         description: Invalid payload.
 *       404:
 *         description: Payment or order not found.
 */
paymentRouter.post(
    "/webhook",
    runExpressEndpoint(handlePaymentWebhook, "post")
)

/**
 * @openapi
 * /payments/{id}:
 *   put:
 *     tags:
 *       - payment
 *     summary: Update an existing payment
 *     parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *              type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               method:
 *                 type: string
 *               paymentStatus:
 *                 type: string
 *                 enum: [PENDING, APPROVED, REJECTED]
 *     responses:
 *       200:
 *         description: Payment updated.
 *       400:
 *         description: Invalid input.
 *       404:
 *         description: Payment not found.
 */
paymentRouter.put("/:id", runExpressEndpoint(updatePayment, "put"))

/**
 * @openapi
 * /payments/{id}:
 *   delete:
 *     tags:
 *       - payment
 *     summary: Delete a payment
 *     parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *              type: number
 *     responses:
 *       204:
 *         description: Payment deleted.
 *       404:
 *         description: Payment not found.
 */
paymentRouter.delete("/:id", runExpressEndpoint(deletePayment, "delete"))

export default paymentRouter
