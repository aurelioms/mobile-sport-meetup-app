import { PrismaClient } from '@prisma/client'
import { sportEventSelect } from '../sportEvent/service'
import { SportEvent } from '../sportEvent/type'
import { User } from './type'

type Deps = {
  prisma: PrismaClient
}

type UpdateProfileParams = {
  id: string
  user: Partial<Omit<User, 'id' | 'email' | 'password' | 'isVerified'>>
}

type DeleteUserParams = {
  id: string
}

type GetJoinedEventParams = {
  id: string
}

type GetCreatedEventsParams = {
  id: string
}

export type UserService = {
  updateProfile: (params: UpdateProfileParams) => Promise<void>
  deleteUser: (params: DeleteUserParams) => Promise<void>
  getJoinedEvents: (params: GetJoinedEventParams) => Promise<SportEvent[]>
  getCreatedEvents: (params: GetCreatedEventsParams) => Promise<SportEvent[]>
}

export const createUserService = (deps: Deps): UserService => {
  const { prisma } = deps

  return {
    updateProfile: async ({ id, user }) => {
      await prisma.user.update({
        where: { id },
        data: user,
      })
    },

    getJoinedEvents: async ({ id }) => {
      return prisma.sportEvent.findMany({
        where: {
          participants: {
            some: { id },
          },
        },
        select: sportEventSelect,
      })
    },

    getCreatedEvents: async ({ id }) => {
      return prisma.sportEvent.findMany({
        where: {
          hostId: id,
        },
        select: sportEventSelect,
      })
    },

    deleteUser: async ({ id }) => {
      await prisma.$transaction([
        prisma.otpCode.deleteMany({
          where: {
            userId: id,
          },
        }),
        prisma.comment.deleteMany({
          where: {
            userId: id,
          },
        }),
        prisma.sportEvent.deleteMany({
          where: {
            hostId: id,
          },
        }),
        prisma.user.delete({
          where: {
            id,
          },
        }),
      ])
    },
  }
}
