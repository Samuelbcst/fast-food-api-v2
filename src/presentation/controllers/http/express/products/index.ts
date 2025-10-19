import { Router } from "express"
import { runExpressEndpoint } from "../generic/run-express-endpoint"
import { createProduct } from "./create"
import { deleteProduct } from "./delete"
import { getProductAll } from "./get-all"
import { getProductByCategory } from "./get-by-category"
import { getProductById } from "./get-by-id"
import { updateProduct } from "./update"

const productRouter = Router()

/**
 * @openapi
 * tags:
 *   - name: product
 *     description: Operations about products
 */

/**
 * @openapi
 * /products:
 *   get:
 *     tags:
 *       - product
 *     summary: Get all products
 *     responses:
 *       200:
 *         description: A list of products.
 */
productRouter.get("/", runExpressEndpoint(getProductAll, "get"))

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     tags:
 *       - product
 *     summary: Get product by ID
 *     parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *              type: number
 *     responses:
 *          200:
 *              description: A product.
 *          404:
 *              description: Product not found.
 */
productRouter.get("/:id", runExpressEndpoint(getProductById, "get"))

/**
 * @openapi
 * /products:
 *   post:
 *     tags:
 *       - product
 *     summary: Create a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 required: true
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *                 required: true
 *               categoryId:
 *                 type: number
 *                 required: true
 *               active:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Product created.
 *       400:
 *         description: Invalid input.
 */
productRouter.post("/", runExpressEndpoint(createProduct, "post"))

/**
 * @openapi
 * /products/{id}:
 *   put:
 *     tags:
 *       - product
 *     summary: Update an existing product
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
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: number
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Product updated.
 *       400:
 *         description: Invalid input.
 *       404:
 *         description: Product not found.
 */
productRouter.put("/:id", runExpressEndpoint(updateProduct, "put"))

/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     tags:
 *       - product
 *     summary: Delete a product
 *     parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *              type: number
 *     responses:
 *       204:
 *         description: Product deleted.
 *       404:
 *         description: Product not found.
 */
productRouter.delete("/:id", runExpressEndpoint(deleteProduct, "delete"))

/**
 * @openapi
 * /products/category/{categoryId}:
 *   get:
 *     tags:
 *       - product
 *     summary: Get products by category
 *     parameters:
 *        - name: categoryId
 *          in: path
 *          required: true
 *          schema:
 *              type: number
 *     responses:
 *          200:
 *              description: A list of products in the category.
 *              content:
 *                application/json:
 *                  schema:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/Product'
 *          404:
 *              description: No products found for this category.
 */
productRouter.get(
    "/category/:categoryId",
    runExpressEndpoint(getProductByCategory, "get")
)

export default productRouter
