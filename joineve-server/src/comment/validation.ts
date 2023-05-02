import { z } from 'zod'

export type GetCommentsByEventParamsSchema = z.infer<
  typeof getCommentsByEventParamsSchema
>

export const getCommentsByEventParamsSchema = z.object({
  sportEventId: z.string(),
})

export type CreateCommentParamsSchema = GetCommentsByEventParamsSchema

export const createCommentParamsSchema = getCommentsByEventParamsSchema

export type CreateCommentBodySchema = z.infer<typeof createCommentBodySchema>

export const createCommentBodySchema = z.object({
  content: z.string(),
})

export type UpdateCommentParamsSchema = z.infer<
  typeof updateCommentParamsSchema
>

export const updateCommentParamsSchema = z.object({
  id: z.string(),
})

export type UpdateCommentBodySchema = CreateCommentBodySchema

export const updateCommentBodySchema = createCommentBodySchema

export type DeleteCommentParamsSchema = UpdateCommentParamsSchema

export const deleteCommentParamsSchema = updateCommentParamsSchema
