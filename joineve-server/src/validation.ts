import * as z from 'zod'

import { createFieldError, createInternalError, InternalStatus } from './error'
import { Handler } from './handler'

type Options = {
  bodySchema?: z.Schema
  querySchema?: z.Schema
  paramsSchema?: z.Schema
}

export const withValidation = (options: Options, handler: Handler): Handler => {
  const { bodySchema, querySchema, paramsSchema } = options

  return (req, res, next) => {
    try {
      if (bodySchema !== undefined) {
        req.zodParsedBody = bodySchema.parse(req.body)
      }

      if (querySchema !== undefined) {
        req.zodParsedQuery = querySchema.parse(req.query)
      }

      if (paramsSchema !== undefined) {
        req.zodParsedParams = paramsSchema.parse(req.params)
      }

      handler(req, res, next)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fields = error.errors.map(({ path, message }) => ({
          key: path.join('.'),
          message,
        }))
        throw createFieldError(InternalStatus.BODY_VALIDATION, fields)
      }

      throw createInternalError(error as Error)
    }
  }
}

export const zodLiteralUnion = (
  union: string[],
  options: { isOptional: boolean } = { isOptional: false },
) => {
  const schema = union.reduce(
    (acc: z.Schema, literal) => acc.or(z.literal(literal)) as z.Schema,
    z.literal(union[0]),
  )

  if (options.isOptional) return schema.optional()
  return schema
}
