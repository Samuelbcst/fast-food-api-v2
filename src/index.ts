import { PrismaCustomer } from "@prisma/customer"
import cors from "cors"
import dotenv from "dotenv"
import express from "express"

dotenv.config()

const app = express()
// const prisma = new PrismaCustomer();
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// Basic health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "ok" })
})

async function main() {
    try {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`)
        })
    } catch (error) {
        console.error("Failed to start the server:", error)
        process.exit(1)
    }
}

main()
