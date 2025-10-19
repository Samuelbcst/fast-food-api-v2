import { Router } from "express"
import { runExpressEndpoint } from "../generic/run-express-endpoint"
import { createOrderItem } from "./create"
import { deleteOrderItem } from "./delete"
import { getOrderItemAll } from "./get-all"
import { getOrderItemById } from "./get-by-id"
import { updateOrderItem } from "./update"

const orderItemRouter = Router()

/**
 * @openapi
 * tags:
 *   - name: order-item
 *     description: Operations about order items
 */

/**
 * @openapi
 * /order-items:
 *   get:
 *     tags:
 *       - order-item
 *     summary: Get all order items
 *     responses:
 *       200:
 *         description: A list of order items.
 */
orderItemRouter.get("/", runExpressEndpoint(getOrderItemAll, "get"))

/**
 * @openapi
 * /order-items/{id}:
 *   get:
 *     tags:
 *       - order-item
 *     summary: Get order item by ID
 *     parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *              type: number
 *     responses:
 *          200:
 *              description: An order item.
 *          404:
 *              description: Order item not found.
 */
orderItemRouter.get("/:id", runExpressEndpoint(getOrderItemById, "get"))

/**
 * @openapi
 * /order-items:
 *   post:
 *     tags:
 *       - order-item
 *     summary: Create a new order item
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
 *               productId:
 *                 type: number
 *                 required: true
 *               quantity:
 *                 type: number
 *                 required: true
 *             required:
 *               - orderId
 *               - productId
 *               - quantity
 *     responses:
 *       201:
 *         description: Order item created.
 *       400:
 *         description: Invalid input.
 */
orderItemRouter.post("/", runExpressEndpoint(createOrderItem, "post"))

/**
 * @openapi
 * /order-items/{id}:
 *   put:
 *     tags:
 *       - order-item
 *     summary: Update an existing order item
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
 *               orderId:
 *                 type: number
 *               productId:
 *                 type: number
 *               quantity:
 *                 type: number
 *             required:
 *               - orderId
 *               - productId
 *               - quantity
 *     responses:
 *       200:
 *         description: Order item updated.
 *       400:
 *         description: Invalid input.
 *       404:
 *         description: Order item not found.
 */
orderItemRouter.put("/:id", runExpressEndpoint(updateOrderItem, "put"))

/**
 * @openapi
 * /order-items/{id}:
 *   delete:
 *     tags:
 *       - order-item
 *     summary: Delete an order item
 *     parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *              type: number
 *     responses:
 *       204:
 *         description: Order item deleted.
 *       404:
 *         description: Order item not found.
 */
orderItemRouter.delete("/:id", runExpressEndpoint(deleteOrderItem, "delete"))

export default orderItemRouter
