import "dotenv/config"
import app from "./app"
import { env } from "./config/env"
import { connectRedis } from "./config/redis"

async function start() {
    await connectRedis()

    app.listen(env.PORT, () => {
    console.log(`Auth service running on port ${env.PORT}`)
    })
}

start()

