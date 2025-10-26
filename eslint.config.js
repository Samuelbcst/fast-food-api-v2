import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";

export default [
    {
        // Global ignores
        ignores: [
            "**/node_modules/**",
            "**/dist/**",
            "**/build/**",
            "**/coverage/**",
            "**/*.config.js",
            "**/*.config.ts",
            "**/vitest.config.ts",
            "**/src/infrastructure/libraries/prisma/migrations/**"
        ]
    },
    {
        // TypeScript files configuration
        files: ["**/*.ts"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: "module",
                project: "./tsconfig.json"
            }
        },
        plugins: {
            "@typescript-eslint": typescriptEslint,
            "import": importPlugin
        },
        rules: {
            // Import boundary rules - THE HEART OF CLEAN ARCHITECTURE ENFORCEMENT
            "import/no-restricted-paths": [
                "error",
                {
                    "zones": [
                        {
                            "target": "./src/domain",
                            "from": "./src/application",
                            "message": "❌ CLEAN ARCHITECTURE VIOLATION: Domain layer cannot import from Application layer. Domain must be independent of application logic."
                        },
                        {
                            "target": "./src/domain",
                            "from": "./src/infrastructure",
                            "message": "❌ CLEAN ARCHITECTURE VIOLATION: Domain layer cannot import from Infrastructure layer. Domain must be independent of technical details."
                        },
                        {
                            "target": "./src/domain",
                            "from": "./src/presentation",
                            "message": "❌ CLEAN ARCHITECTURE VIOLATION: Domain layer cannot import from Presentation layer. Domain must be independent of UI/controllers."
                        },
                        {
                            "target": "./src/application",
                            "from": "./src/infrastructure",
                            "message": "❌ CLEAN ARCHITECTURE VIOLATION: Application layer cannot import from Infrastructure layer. Use dependency inversion via ports/interfaces instead."
                        },
                        {
                            "target": "./src/application",
                            "from": "./src/presentation",
                            "message": "❌ CLEAN ARCHITECTURE VIOLATION: Application layer cannot import from Presentation layer. Application should not know about controllers/HTTP."
                        },
                        {
                            "target": "./src/infrastructure",
                            "from": "./src/presentation",
                            "message": "❌ CLEAN ARCHITECTURE VIOLATION: Infrastructure layer cannot import from Presentation layer. Keep infrastructure and presentation separated."
                        }
                    ]
                }
            ],

            // TypeScript rules
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    "argsIgnorePattern": "^_",
                    "varsIgnorePattern": "^_"
                }
            ],

            // General rules
            "no-console": "off"
        }
    }
];
