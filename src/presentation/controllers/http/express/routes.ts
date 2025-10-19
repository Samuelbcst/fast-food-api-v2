import { Router } from "express"
import categoryRouter from "./categories"
import customerRouter from "./customers"
import orderItemRouter from "./order-items"
import orderRouter from "./orders"
import paymentRouter from "./payments"
import productRouter from "./products"

const routes = Router()

routes.use("/v1/categories", categoryRouter)
routes.use("/v1/products", productRouter)
routes.use("/v1/customers", customerRouter)
routes.use("/v1/orders", orderRouter)
routes.use("/v1/order-items", orderItemRouter)
routes.use("/v1/payments", paymentRouter)

export default routes
