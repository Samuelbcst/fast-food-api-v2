import express from "express"
import "reflect-metadata"
import routes from "./routes"
import { swaggerSpec, swaggerUi } from "./swagger"
import { errorHandler } from "./middleware/error-handler"
import { requestLogger } from "./middleware/request-logger"

/**
 * Express Application Configuration
 *
 * Middleware Order is CRITICAL:
 * 1. Request parsing (express.json)
 * 2. Request logging
 * 3. Routes
 * 4. Error handling (MUST BE LAST!)
 */
const app = express()

// ===================================================================
// STEP 1: Request Parsing Middleware
// ===================================================================
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ===================================================================
// STEP 2: Request Logging Middleware
// ===================================================================
app.use(requestLogger)

// ===================================================================
// STEP 3: Routes
// ===================================================================
app.use("/api", routes)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// ===================================================================
// STEP 4: Error Handling Middleware (MUST BE LAST!)
// ===================================================================
// This catches all errors thrown in routes/controllers
app.use(errorHandler)

export default app
