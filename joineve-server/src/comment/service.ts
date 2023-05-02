import { PrismaClient } from '@prisma/client'
import { Comment, CommentData } from './type'
import { nanoid } from 'nanoid'

type Deps = {
  prisma: PrismaClient
}

type getCommentsByEventParams = {
  sportEventId: string
}

type CreateCommentParams = {
  comment: CommentData
}

type UpdateCommentParams = {
  id: string
  comment: Partial<CommentData>
}

type DeleteCommentParams = { id: string }

export type CommentService = {
  getCommentsByEvent: (params: getCommentsByEventParams) => Promise<Comment[]>
  createComment: (params: CreateCommentParams) => Promise<void>
  updateComment: (params: UpdateCommentParams) => Promise<void>
  deleteComment: (params: DeleteCommentParams) => Promise<void>
}

export const createCommentService = (deps: Deps): CommentService => {
  const { prisma } = deps

  return {
    getCommentsByEvent: async ({ sportEventId }) => {
      return prisma.comment.findMany({
        where: { sportEventId },
        select: {
          id: true,
          userId: true,
          user: true,
          sportEventId: true,
          content: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      })
    },

    createComment: async ({ comment }) => {
      await prisma.comment.create({
        data: {
          ...comment,
          id: nanoid(),
          createdAt: new Date(),
        },
      })
    },

    updateComment: async ({ id, comment }) => {
      await prisma.comment.update({
        where: { id },
        data: {
          ...comment,
          updatedAt: new Date(),
        },
      })
    },

    deleteComment: async ({ id }) => {
      await prisma.comment.delete({ where: { id } })
    },
  }
}
