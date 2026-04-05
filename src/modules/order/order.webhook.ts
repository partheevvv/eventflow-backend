import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { OrderStatus } from "../../generated/prisma";
import { stripe } from "../../config/stripe";
import { orderQueue } from "./order.queue";

export async function stripeWebhook(req: Request, res: Response) {
    
    const sig = req.headers["stripe-signature"]!
    let event

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (err) {
        return res.status(400).send("Webhook Error")
    }

    if (event.type === "payment_intent.succeeded") {

        try {
            const paymentIntent = event.data.object as any
            const orderId = paymentIntent.metadata?.orderId
    
            if (!orderId) {
                console.log("Missing orderId in metadata")
                return res.json({ received: true })
            }
    
            console.log("PaymentIntent:", paymentIntent)
            console.log("Order id from metadata:", orderId)
    
            const existingOrder = await prisma.order.findUnique({
                where: { id: orderId }
            })
    
            if (!existingOrder) {
                console.log("Order not found")
                return res.json({
                    received: true
                })
            }
    
            if (existingOrder.status === OrderStatus.PAID) {
                console.log("Order already paid, skipping")
                return res.json({
                    received: true
                })
            }
    
            await prisma.$transaction(async (tx) => {
                
                const order = await tx.order.findUnique({
                    where: { id: orderId }
                })
                
                if (!order) return

                const ticket = await tx.ticket.findUnique({
                    where:{ id: order.ticketId }
                })

                if (!ticket) return

                if (ticket.quantity < order.quantity) return

                await tx.ticket.update({
                    where: {
                        id: ticket.id,
                        quantity: { gte: order.quantity }
                    },
                    data: {
                        quantity: {
                            decrement: order.quantity
                        }
                    }
                })

                await tx.order.update({
                    where: { id: orderId },
                    data: { status: OrderStatus.PAID }
                })

            })
            
            await orderQueue.add("orderPaid", { orderId })
            
        } catch (error) {
            console.error("Webhook processing error:", error)
        }
    }

    res.json({ received: true })
}