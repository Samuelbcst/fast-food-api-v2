import { Router } from "express"

import { runExpressEndpoint } from "../generic/run-express-endpoint"
import { createCustomer } from "./create"
import { deleteCustomer } from "./delete"
import { getCustomerAll } from "./get-all"
import { getCustomerByCpf } from "./get-by-cpf"
import { getCustomerById } from "./get-by-id"
import { updateCustomer } from "./update"

const customerRouter = Router()

/**
 * @openapi
 * tags:
 *   - name: customer
 *     description: Operations about customers
 */

/**
 * @openapi
 * /customers:
 *   get:
 *     tags:
 *       - customer
 *     summary: Get all customers
 *     responses:
 *       200:
 *         description: A list of customers.
 */
customerRouter.get("/", runExpressEndpoint(getCustomerAll, "get"))

/**
 * @openapi
 * /customers/{id}:
 *   get:
 *     tags:
 *       - customer
 *     summary: Get customer by ID
 *     parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *              type: number
 *     responses:
 *          200:
 *              description: A customer object.
 *          404:
 *              description: Customer not found.
 */
customerRouter.get("/:id", runExpressEndpoint(getCustomerById, "get"))

/**
 * @openapi
 * /customers/cpf/{cpf}:
 *   get:
 *     tags:
 *       - customer
 *     summary: Get customer by CPF
 *     parameters:
 *        - name: cpf
 *          in: path
 *          required: true
 *          schema:
 *              type: string
 *     responses:
 *          200:
 *              description: A customer object.
 *              content:
 *                application/json:
 *                  schema:
 *                    $ref: '#/components/schemas/Customer'
 *          404:
 *              description: Customer not found.
 */
customerRouter.get("/cpf/:cpf", runExpressEndpoint(getCustomerByCpf, "get"))

/**
 * @openapi
 * /customers:
 *   post:
 *     tags:
 *       - customer
 *     summary: Create a new customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: name
 *               email:
 *                 type: string
 *                 description: email
 *               cpf:
 *                 type: string
 *                 description: CPF
 *             required:
 *               - name
 *               - email
 *               - cpf
 *     responses:
 *       201:
 *         description: Customer created.
 *       400:
 *         description: Invalid input.
 */
customerRouter.post("/", runExpressEndpoint(createCustomer, "post"))

/**
 * @openapi
 * /customers/{id}:
 *   put:
 *     tags:
 *       - customer
 *     summary: Update an existing customer
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
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               cpf:
 *                 type: string
 *     responses:
 *       200:
 *         description: Customer updated.
 *       400:
 *         description: Invalid input.
 *       404:
 *         description: Customer not found.
 */
customerRouter.put("/:id", runExpressEndpoint(updateCustomer, "put"))

/**
 * @openapi
 * /customers/{id}:
 *   delete:
 *     tags:
 *       - customer
 *     summary: Delete a customer
 *     parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *              type: number
 *     responses:
 *       204:
 *         description: Customer deleted.
 *       404:
 *         description: Customer not found.
 */
customerRouter.delete("/:id", runExpressEndpoint(deleteCustomer, "delete"))

export default customerRouter
