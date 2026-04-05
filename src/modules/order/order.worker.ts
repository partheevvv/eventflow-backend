import { Worker } from "bullmq"
import { redis } from "../../config/redis"
import { queueConnection } from "../../config/queue"

const worker = new Worker(
    "orderQueue",
    async (job) => {

        console.log("Job received:", job.name)

        if (job.name === "orderPaid") {
            const { orderId } = job.data

            console.log("Sending mail for order:", orderId)

            await new Promise((res) => setTimeout(res, 1000))

            console.log("Email sent for order:", orderId)
        }
    },
    {
        connection: queueConnection,
        concurrency: 5 //process 5 jobs at once
    }
)

worker.on("completed", (job) => {
    console.log(`Job completed: ${job.id}`)
})

worker.on("failed", (job, err) => {
    console.log(`Job failed: ${job?.id}`, err)
})