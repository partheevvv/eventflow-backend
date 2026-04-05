import { prisma } from "../../config/database";
import { Prisma } from "../../generated/prisma";

export const OrderRepository = {

    async createOrder(data: Prisma.OrderCreateInput, tx: Prisma.TransactionClient) {
        return tx.order.create({ data })
    },

    async getOrdersByUser(userId: string) {
        return prisma.order.findMany({
            where: { userId },
            include: {
                ticket: {
                    include: {
                        event: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        })
    }
}