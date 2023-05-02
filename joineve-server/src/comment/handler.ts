import { Handler } from '../handler'
import { withValidation } from '../validation'
import { CommentService } from './service'
import {
  CreateCommentBodySchema,
  createCommentBodySchema,
  CreateCommentParamsSchema,
  createCommentParamsSchema,
  DeleteCommentParamsSchema,
  deleteCommentParamsSchema,
  GetCommentsByEventParamsSchema,
  getCommentsByEventParamsSchema,
  updateCommentBodySchema,
  UpdateCommentBodySchema,
  updateCommentParamsSchema,
  UpdateCommentParamsSchema,
} from './validation'

type CommentHandlerDeps = {
  commentService: CommentService
}

export const getCommentsByEventHandler = (deps: CommentHandlerDeps): Handler =>
  withValidation(
    {
      paramsSchema: getCommentsByEventParamsSchema,
    },
    async (req, res, next) => {
      try {
        const { commentService } = deps
        const { sportEventId } =
          req.zodParsedParams as GetCommentsByEventParamsSchema

        const comments = await commentService.getCommentsByEvent({
          sportEventId,
        })

        return res.json({ data: comments })
      } catch (error) {
        next(error)
      }
    },
  )

export const createCommentHandler = (deps: CommentHandlerDeps): Handler =>
  withValidation(
    {
      paramsSchema: createCommentParamsSchema,
      bodySchema: createCommentBodySchema,
    },
    async (req, res, next) => {
      try {
        const { commentService } = deps
        const { sportEventId } =
          req.zodParsedParams as CreateCommentParamsSchema
        const { content } = req.zodParsedBody as CreateCommentBodySchema

        await commentService.createComment({
          comment: {
            content,
            sportEventId,
            userId: req.user.id,
          },
        })

        return res.json({ success: true })
      } catch (error) {
        next(error)
      }
    },
  )

export const updateCommentHandler = (deps: CommentHandlerDeps): Handler =>
  withValidation(
    {
      paramsSchema: updateCommentParamsSchema,
      bodySchema: updateCommentBodySchema,
    },
    async (req, res, next) => {
      try {
        const { commentService } = deps
        const { id } = req.zodParsedParams as UpdateCommentParamsSchema
        const { content } = req.zodParsedBody as UpdateCommentBodySchema

        await commentService.updateComment({
          id,
          comment: {
            content,
          },
        })

        return res.json({ success: true })
      } catch (error) {
        next(error)
      }
    },
  )

export const deleteCommentHandler = (deps: CommentHandlerDeps): Handler =>
  withValidation(
    {
      paramsSchema: deleteCommentParamsSchema,
    },
    async (req, res, next) => {
      try {
        const { commentService } = deps
        const { id } = req.zodParsedParams as DeleteCommentParamsSchema

        await commentService.deleteComment({ id })

        return res.json({ success: true })
      } catch (error) {
        next(error)
      }
    },
  )
