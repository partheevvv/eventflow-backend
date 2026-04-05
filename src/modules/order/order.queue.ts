import { Queue } from "bullmq";
import { queueConnection } from "../../config/queue";

export const orderQueue = new Queue("orderQueue", {
    connection: queueConnection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 1000
        },
        removeOnComplete: true,
        removeOnFail: false
    }
})