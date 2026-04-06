import { redis } from "../../config/redis";
import { ApiError } from "../../utils/ApiError";
import { EventRepository } from "./event.repository";
import { CreateEventDTO } from "./event.validation";
import { Prisma } from "../../generated/prisma";

async function clearEventsCache() {
    if (!redis.isOpen) {
        return
    }

    const keys = await redis.keys("events:*")

    if (keys.length > 0) {
        await redis.del(keys)
    }
}

async function clearEventByIdCache(id: string) {
    if (!redis.isOpen) {
        return
    }

    await redis.del(`event:${id}`)
}

export const EventService = {
     
    async createEvent(
        data: CreateEventDTO,
        userId: string
    ) {

        const parsedDate = new Date(data.date)

        if (isNaN(parsedDate.getTime())) {
            throw new ApiError(400, "Invalid date format")
        }

        await clearEventsCache()

        return EventRepository.createEvent({
            title: data.title,
            description: data.description,
            location: data.location,
            date: parsedDate,
            capacity: data.capacity,
            creator: {
                connect: { id: userId }
            }
        })
    },

    async getEvents({ page, limit, location }: {
        page: number
        limit: number
        location?: string
    }) {

        const cacheKey = `events:${page}:${limit}:${location || 'all'}`

        console.log("Cache key:", cacheKey)

        const cached = redis.isOpen
            ? await redis.get(cacheKey)
            : null

        if (cached) {
            console.log("Cache HIT")
            return JSON.parse(cached)
        }

        console.log("Cache MISS")

        const skip = (page -1) * limit

        const events = await EventRepository.getEvents({
            skip,
            limit,
            location
        })

        const response = {
            page,
            limit,
            results: events.length,
            data: events
        }

        if (redis.isOpen) {
            await redis.set(cacheKey, JSON.stringify(response), { EX: 60 })
        }

        return response
    },

    async getEventById(id: string) {

        const cacheKey = `event:${id}`
        
        const cached = redis.isOpen
            ? await redis.get(cacheKey)
            : null

        if (cached) {
            return JSON.parse(cached)
        }

        const event = await EventRepository.getEventById(id)

        if (!event) {
            throw new ApiError(404, "Event not found")
        }

        if (redis.isOpen) {
            await redis.set(cacheKey, JSON.stringify(event), { EX: 60 })
        }
        
        return event
    },

    async updateEvent(
        id: string,
        data: Partial<CreateEventDTO>,
        userId: string
    ) {
        const event = await EventRepository.getEventById(id)

        if (!event) {
            throw new ApiError(404, "Event not found")
        }

        //Ownership check
        if (event.creatorId !== userId) {
            throw new ApiError(403, "You are not allowed to update this event")
        }

        const { date } = data

        let updatedData: Prisma.EventUpdateInput = { ...data }

        if (date) {
            const parsedDate = new Date(date)
            
            if (isNaN(parsedDate.getTime())) {
                throw new ApiError(400, "Invalid date format")
            }

            updatedData.date = parsedDate
        }

        const updated = await EventRepository.updateEvent(id, updatedData)

        await clearEventsCache()
        await clearEventByIdCache(id)

        return updated
    },

    async deleteEvent(id: string, userId:string) {
        const event = await EventRepository.getEventById(id)

        if (!event) {
            throw new ApiError(404, "Event not found")
        }

        //Ownership check
        if(event.creatorId !== userId) {
            throw new ApiError(403, "You are not allowed to delete this event")
        }
        
        await EventRepository.deleteEvent(id)
        
        await clearEventsCache()
        await clearEventByIdCache(id)
        
        return { message: "Event deleted successfully" }
    }
}