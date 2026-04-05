import express from "express"
import cors from "cors"
import authRoutes from "./modules/auth/auth.routes"
import { errorMiddleware } from "./middleware/error.middleware";
import eventRoutes from "./modules/event/event.routes"
import ticketRoutes from "./modules/ticket/ticket.routes"
import orderRoutes from "./modules/order/order.routes"
import { redis } from "./config/redis";
import { stripeWebhook } from "./modules/order/order.webhook";

const app = express();

app.use(cors());

app.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    stripeWebhook
)

app.use(express.json());

app.use("/auth", authRoutes);

app.use("/events", eventRoutes);

app.use("/tickets", ticketRoutes);

app.use("/orders", orderRoutes)

app.get("/health", (req, res) => {
    res.json({ status: "ok" })
})

app.get("/test-redis", async (req, res) => {
    await redis.set("test", "hello redis")
    const value = await redis.get("test")

    res.json({ value })
})


app.use(errorMiddleware)

export default app