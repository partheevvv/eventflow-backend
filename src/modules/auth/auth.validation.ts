import { z } from "zod"

export const registerSchema = z.object({
    email: z.email(),
    password: z.string()
    .min(8)
    .regex(/[A-Z]/, "Must contain uppercase")
    .regex(/[0-9]/, "Must contain number")
})

export const loginSchema = z.object({
    email: z.email(),
    password: z.string()
    .min(8)
})