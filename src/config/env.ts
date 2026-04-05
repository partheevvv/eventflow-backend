import { z } from "zod"

const envSchema = z.object({
    PORT: z.string().default("4000"),
    DATABASE_URL: z.string(),
    JWT_SECRET: z.string(),
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
    REDIS_URL: z.string().default("redis://localhost:6379")
})

type Env = z.infer<typeof envSchema>

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
    console.error("Invalid environment variables")
    console.error(parsedEnv.error.format())

    if (process.env.NODE_ENV !== "test") {
        process.exit(1)
    }
}

export const env: Env = parsedEnv.success
? parsedEnv.data
: {
    PORT: "4000",
    JWT_SECRET: "test-secret",
    DATABASE_URL: process.env.DATABASE_URL || "",
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379"
}