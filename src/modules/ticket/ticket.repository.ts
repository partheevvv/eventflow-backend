import { prisma } from "../../config/database";
import { Prisma } from "../../generated/prisma";

export const TicketRepository = {

    async createTicket(data: Prisma.TicketCreateInput) {
        return prisma.ticket.create({ data })
    },

    async getTicketsByEvent(eventId: string) {
        return prisma.ticket.findMany({
            where: { eventId }
        })
    }

}