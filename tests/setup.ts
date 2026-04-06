import "dotenv/config"
import { prisma } from "../src/config/database"
import { redis } from "../src/config/redis"

async function cleanDatabase() {
    await prisma.order.deleteMany()
    await prisma.ticket.deleteMany()
    await prisma.event.deleteMany()
    await prisma.user.deleteMany()
}

beforeAll(async () => {
    await cleanDatabase()
    console.log("Test environment setup")
})

afterAll(async () => {
    await cleanDatabase()

    if (redis.isOpen) {
        await redis.quit()
    }

    await prisma.$disconnect()
})