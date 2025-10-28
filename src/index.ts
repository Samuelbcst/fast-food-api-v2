import dotenv from "dotenv"
import app from "./presentation/controllers/http/express/app"

// Load environment variables
dotenv.config({ path: "./src/.env" })

const PORT = process.env.HOST_PORT || 3000

/**
 * Start the Express server
 */
function main() {
    try {
        const server = app.listen(PORT, () => {
            console.log(`\n🚀 Fast-Food API Server Started`)
            console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
            console.log(`📡 Server running on: http://localhost:${PORT}`)
            console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`)
            console.log(`🏥 Health Check: http://localhost:${PORT}/api/v1/health`)
            console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)
        })

        // Handle shutdown gracefully
        process.on('SIGTERM', () => {
            console.log('\n🛑 SIGTERM received, shutting down gracefully...')
            server.close(() => {
                console.log('✅ Server closed')
                process.exit(0)
            })
        })

        process.on('SIGINT', () => {
            console.log('\n🛑 SIGINT received, shutting down gracefully...')
            server.close(() => {
                console.log('✅ Server closed')
                process.exit(0)
            })
        })
    } catch (error) {
        console.error("❌ Failed to start the server:", error)
        process.exit(1)
    }
}

main()
