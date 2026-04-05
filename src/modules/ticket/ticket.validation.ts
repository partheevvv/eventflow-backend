import { z } from "zod"
import { createEventSchema } from "../event/event.validation"

export const createTicketSchema = z.object({
    eventId: z.string().uuid(),
    name: z.string().min(2, "Ticket name is required"),
    price: z.number().positive("Price must be greater than 0"),
    quantity: z.number().int().positive("Quantity must be greater than 0")
})

export type CreateTicketDTO = z.infer<typeof createTicketSchema>