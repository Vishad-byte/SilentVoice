import {z} from 'zod';

export const signInSchema = z.object({
    identifier: z.string(),            //production grade name for username or email
    password: z.string(),
})