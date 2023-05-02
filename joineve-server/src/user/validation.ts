import { z } from 'zod'
import { parseToDate } from '../util'

export type UpdateProfileBodySchema = z.infer<typeof updateProfileBodySchema>

export const updateProfileBodySchema = z.object({
  name: z.string().trim().nonempty({ message: 'Name cannot be empty' }),
  gender: z.string().optional().nullable(),
  profileImagePath: z.string().optional().nullable(),
  birthDate: z
    .preprocess((value) => parseToDate(value), z.date())
    .refine(
      (date) => {
        return Number(date) < Number(new Date())
      },
      {
        message: 'Birth date should not be greater than today',
      },
    )
    .optional()
    .nullable(),
})
