import { z } from "zod"

export const createEventSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    location: z.string(),
    date: z.string(),
    capacity: z.number().int().positive()
})

export type CreateEventDTO = z.infer<typeof createEventSchema>