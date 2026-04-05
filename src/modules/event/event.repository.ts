import { prisma } from "../../config/database";
import { Prisma } from "../../generated/prisma";

export const EventRepository = {
    
    async createEvent(data: Prisma.EventCreateInput) {
        return prisma.event.create({
            data
        })
    },

    async getEvents({ skip, limit, location }: {
        skip: number,
        limit: number,
        location?: string
    }) {
        return prisma.event.findMany({
            
            where: location
            ? {
                location: {
                    contains: location,
                    mode: "insensitive"
                }
            }: {},

            skip,
            take: limit,

            orderBy: { createdAt: "desc" }
        })
    },

    async getEventById(id: string) {
        return prisma.event.findUnique({
            where: { id }
        })
    },

    async updateEvent(id: string, data: any) {
        return prisma.event.update({
            where: { id },
            data
        })
    },

    async deleteEvent(id: string) {
        return prisma.event.delete({
            where: { id }
        })
    }
}