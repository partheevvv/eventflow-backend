import { ApiError } from "../../utils/ApiError"
import { EventRepository } from "../event/event.repository"
import { TicketRepository } from "./ticket.repository"
import { CreateTicketDTO } from "./ticket.validation"

export const TicketService = {

    async createTicket(data: CreateTicketDTO, userId: string) {
        const event = await EventRepository.getEventById(data.eventId)

        if (!event) {
            throw new ApiError(404, "Event not found")
        }

        //only creator can add tickets
        if (event.creatorId !== userId) {
            throw new ApiError(403, "You are not allowed to create tickets for this event")
        }

        return TicketRepository.createTicket({
            name: data.name,
            price: data.price,
            quantity: data.quantity,
            event: {
                connect: { id: data.eventId }
            }
        })
    },

    async getTickets(eventId: string) {
        return TicketRepository.getTicketsByEvent(eventId)
    }
}