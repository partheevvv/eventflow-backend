import IORedis from "ioredis"
import { env } from "./env"

export const queueConnection = new IORedis(env.REDIS_URL, {
    maxRetriesPerRequest: null
})