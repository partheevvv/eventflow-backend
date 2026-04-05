import { z } from "zod"

export const createOrderSchema = z.object({
    ticketId: z.string().uuid(),
    quantity: z.number().int().positive()
})

export type CreateOrderDTO = z.infer<typeof createOrderSchema>
