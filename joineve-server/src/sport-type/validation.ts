import { z } from 'zod'

export type GetSportTypeParamsSchema = z.infer<typeof getSportTypeParamsSchema>

export const getSportTypeParamsSchema = z.object({
  id: z.string(),
})
