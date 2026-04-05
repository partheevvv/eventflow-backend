import "dotenv/config"
import { prisma } from "../src/config/database"
import { connectRedis, redis } from "../src/config/redis"
import { orderQueue } from "../src/modules/order/order.queue"
import { queueConnection } from "../src/config/queue"

async function cleanDatabase() {
    await prisma.order.deleteMany()
    await prisma.ticket.deleteMany()
    await prisma.event.deleteMany()
    await prisma.user.deleteMany()
}

beforeAll(async () => {
    if (!redis.isOpen) {
        await connectRedis()
    }

    await cleanDatabase()
    console.log("Test environment setup")
})

afterAll(async () => {
    await cleanDatabase()

    if (redis.isOpen) {
        await redis.quit()
    }

    await orderQueue.close()
    await queueConnection.quit()
    await prisma.$disconnect()
})