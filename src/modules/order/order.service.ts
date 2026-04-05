import { prisma } from "../../config/database";
import { ApiError } from "../../utils/ApiError";
import { CreateOrderDTO } from "./order.validation";
import { OrderRepository } from "./order.repository";
import { OrderStatus } from "../../generated/prisma";
import { stripe } from "../../config/stripe";

export const OrderService = {

    async createOrder(data: CreateOrderDTO, userId: string) {

        return prisma.$transaction(async (tx) => {

            //Get tickets
            const ticket = await tx.ticket.findUnique({
                where: { id: data.ticketId }
            })
            
            if (!ticket) {
                throw new ApiError(404, "Ticket not found")
            }

            //Get ticket stock
            if (ticket.quantity < data.quantity) {
                throw new ApiError(400, "Not enough tickets available")
            }
            
            //Calculate total price
            const total = ticket.price * data.quantity

            //Create order
            const order = await tx.order.create({
                data: {
                    user: {
                        connect: { id: userId }
                    },
                    ticket: {
                        connect: { id: ticket.id }
                    },
                    quantity: data.quantity,
                    total,
                    status: OrderStatus.PENDING
                }
            })

            return order
        })
    },

    async getMyOrders(userId: string) {
        return OrderRepository.getOrdersByUser(userId)
    },

    async cancelOrder(orderId: string, userId: string) {

        const order = await prisma.order.findUnique({
            where: { id: orderId }
        })

        if (!order) {
            throw new ApiError(404, "Order not found")
        }

        if (order.userId !== userId) {
            throw new ApiError(403, "You are not allowed to cancel this order")
        }

        if (order.status !== OrderStatus.PENDING) {
            throw new ApiError(400, "Only pending orders can be cancelled")
        }

        return prisma.order.update({
            where: { id: orderId },
            data: {
                status: OrderStatus.CANCELLED
            }
        })
    },

    async createPaymentIntent(orderId: string, userId: string) {

        const order = await prisma.order.findUnique({
            where: { id: orderId } 
        })

        if (!order) {
            throw new ApiError(404, "Order not found")
        } 

        if (order.userId !== userId) {
            throw new ApiError(403, "Not allowed")
        }

        if (order.status !== OrderStatus.PENDING) {
            throw new ApiError(400, "Order not payable")
        }

        if (order.paymentIntentId) {
            return {
                message: "Payment already initiated",
                paymentIntentId: order.paymentIntentId
            }
        }

        const ticket = await prisma.ticket.findUnique({
            where: { id: order.ticketId }
        })

        if (!ticket || ticket.quantity < order.quantity) {
            throw new ApiError(400, "Tickets no longer available")
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(order.total * 100),
            currency: "inr",
            metadata: {
                orderId: order.id
            }
        })

        await prisma.order.update({
            where: { id: orderId },
            data: {
                paymentIntentId: paymentIntent.id
            }
        })

        console.log("Payment Intent created:", paymentIntent.id)

        return {
            clientSecret: paymentIntent.client_secret,
            paymentIntent: paymentIntent.id
        }
    }
}