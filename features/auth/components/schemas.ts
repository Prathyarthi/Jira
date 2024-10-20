import { z } from 'zod'

export const signupSchema = z.object({
    name: z.string().trim().min(1, 'Name is required'),
    email: z.string().email(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const signinSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, 'Password must be at least 1 character'),
})