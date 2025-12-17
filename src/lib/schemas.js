import { z } from 'zod'

export const checkoutSchema = z.object({
  name: z.string().min(2),
  address: z.string().min(5),
  city: z.string().min(2),
  postal: z.string().min(3)
})
