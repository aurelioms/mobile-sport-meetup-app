import { z } from 'zod'
import { parseToDate } from '../util'

export type GetSportEventsParamsSchema = z.infer<
  typeof getSportEventsParamsSchema
>

export const getSportEventsParamsSchema = z.object({
  keyword: z.string().optional(),
  lat: z.string().optional(),
  long: z.string().optional(),
  fromDate: z.preprocess((value) => parseToDate(value), z.date()).optional(),
  toDate: z.preprocess((value) => parseToDate(value), z.date()).optional(),
  city: z.string().optional(),
  sportType: z.string().optional(),
  isCancelled: z
    .preprocess((value) => value === 'true', z.boolean())
    .optional(),
})

export type GetSportEventParamsSchema = z.infer<
  typeof getSportEventParamsSchema
>

export const getSportEventParamsSchema = z.object({
  id: z.string(),
})

export type GetSportEventPeopleParamsSchema = z.infer<
  typeof getSportEventPeopleParamsSchema
>

export const getSportEventPeopleParamsSchema = z.object({
  id: z.string(),
})

export type CreateSportEventBodySchema = z.infer<
  typeof createSportEventBodySchema
>

export const createSportEventBodySchema = z
  .object({
    name: z.string().trim().nonempty({ message: 'Event name cannot be empty' }),
    description: z.string().trim(),
    sportTypeId: z
      .string()
      .trim()
      .nonempty({ message: 'Sport type should be selected' }),
    startAt: z.preprocess((value) => parseToDate(value), z.date()),
    endAt: z.preprocess((value) => parseToDate(value), z.date()),
    maxParticipant: z.number().min(1),
    addressStreet: z
      .string()
      .trim()
      .nonempty({ message: 'Address street cannot be empty' }),
    addressCity: z.string().nonempty({ message: 'City should be selected' }),
    addressPostalCode: z
      .string()
      .trim()
      .nonempty({ message: 'Postal code cannot be empty' }),
    longitude: z.string(),
    latitude: z.string(),
  })
  .refine(
    ({ startAt, endAt }) => {
      return Number(new Date(startAt)) < Number(new Date(endAt))
    },
    { path: ['endAt'], message: 'End at must greater than start at' },
  )

export type UpdateSportEventParamsSchema = z.infer<
  typeof updateSportEventParamsSchema
>

export const updateSportEventParamsSchema = z.object({
  id: z.string(),
})

export type JoinSportEventParamsSchema = z.infer<
  typeof joinSportEventParamsSchema
>

export const joinSportEventParamsSchema = z.object({
  id: z.string(),
})

export type CancelJoinSportEventParamsSchema = z.infer<
  typeof cancelJoinSportEventParamsSchema
>

export const cancelJoinSportEventParamsSchema = z.object({
  id: z.string(),
})

export type UpdateSportEventBodySchema = z.infer<
  typeof updateSportEventBodySchema
>

export const updateSportEventBodySchema = z
  .object({
    name: z.string().trim().nonempty({ message: 'Event name cannot be empty' }),
    description: z.string().trim(),
    sportTypeId: z
      .string()
      .nonempty({ message: 'Sport type should be selected' }),
    startAt: z.preprocess((value) => parseToDate(value), z.date()),
    endAt: z.preprocess((value) => parseToDate(value), z.date()),
    maxParticipant: z.number().min(1),
    addressStreet: z
      .string()
      .trim()
      .nonempty({ message: 'Address street cannot be empty' }),
    addressCity: z
      .string()
      .trim()
      .nonempty({ message: 'City should be selected' }),
    addressPostalCode: z
      .string()
      .trim()
      .nonempty({ message: 'Postal code cannot be empty' }),
    longitude: z.string(),
    latitude: z.string(),
  })
  .refine(
    ({ startAt, endAt }) => {
      return Number(new Date(startAt)) < Number(new Date(endAt))
    },
    { path: ['endAt'], message: 'End at must greater than start at' },
  )

export type CancelSportEventParamsSchema = z.infer<
  typeof cancelSportEventParamsSchema
>

export const cancelSportEventParamsSchema = z.object({
  id: z.string(),
})

export type DeleteSportEventParamsSchema = z.infer<
  typeof deleteSportEventParamsSchema
>

export const deleteSportEventParamsSchema = z.object({
  id: z.string(),
})
