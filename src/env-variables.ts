import { config } from "dotenv"
import { join } from "path"
import { z } from "zod"

config({ path: join(__dirname, "/.env") })

const envSchema = z
    .object({
        HOST_PORT: z.string().default("3000"),
        DATABASE_USER: z.string().default("root"),
        DATABASE_PASSWORD: z.string().default("postgres"),
        DATABASE_HOST: z.string().default("postgres"),
        DATABASE_PORT: z
            .string()
            .default("5432")
            .transform((val) => Number(val)),
        DATABASE: z.string().default("api-scaffold"),
    })
    .parse(process.env)

export const {
    HOST_PORT,
    DATABASE_USER,
    DATABASE_PASSWORD,
    DATABASE_HOST,
    DATABASE_PORT,
    DATABASE,
} = envSchema
