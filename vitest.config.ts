import { defineConfig } from "vitest/config"

export default defineConfig({
    test: {
        environment: "node",
        coverage: {
            reporter: ["text", "json", "html"],
        },
        include: [
            "src/**/*.test.ts",
            "src/**/*.spec.ts",
            "src/**/*.e2e.test.ts",
        ],
    },
})
