import { PrismaClient } from '@prisma/client'
import { EventUser, SportEvent, SportEventData } from './type'
import { nanoid } from 'nanoid'
import { createErrorWithMessage, InternalStatus, StatusCodes } from '../error'

type Deps = {
  prisma: PrismaClient
}

type GetSportEventsParams = {
  keyword?: string
  lat?: string
  long?: string
  fromDate?: Date
  toDate?: Date
  city?: string
  sportType?: string
  isCancelled?: boolean
}

type GetSportEventParams = { id: string; userId: string }

type GetSportEventReturn = SportEvent & {
  isCreator: boolean
  hasJoined: boolean
}

type CreateSportEventParams = {
  sportEvent: SportEventData
}

type UpdateSportEventParams = {
  id: string
  sportEvent: Partial<SportEventData>
}

type JoinEventParams = {
  id: string
  userId: string
}

type CancelJoinEventParams = JoinEventParams

type DeleteSportEventParams = { id: string }

type CancelSportEventParams = { id: string }

type GetPeopleParams = { id: string }

export type SportEventService = {
  getSportEvents: (params: GetSportEventsParams) => Promise<SportEvent[]>
  getSportEvent: (
    params: GetSportEventParams,
  ) => Promise<GetSportEventReturn | null>
  createSportEvent: (params: CreateSportEventParams) => Promise<void>
  updateSportEvent: (params: UpdateSportEventParams) => Promise<void>
  getPeople: (params: GetPeopleParams) => Promise<EventUser[]>
  joinEvent: (params: JoinEventParams) => Promise<void>
  cancelJoinEvent: (params: CancelJoinEventParams) => Promise<void>
  deleteSportEvent: (params: DeleteSportEventParams) => Promise<void>
  cancelSportEvent: (params: CancelSportEventParams) => Promise<void>
}

const userSelect = {
  id: true,
  name: true,
  email: true,
  profileImagePath: true,
  isVerified: true,
  createdAt: true,
  updatedAt: true,
}

export const sportEventSelect = {
  id: true,
  name: true,
  description: true,
  sportTypeId: true,
  hostId: true,
  startAt: true,
  endAt: true,
  maxParticipant: true,
  addressStreet: true,
  addressCity: true,
  addressPostalCode: true,
  longitude: true,
  latitude: true,
  createdAt: true,
  updatedAt: true,
  cancelledAt: true,
  host: { select: userSelect },
  participants: { select: userSelect },
  sportType: true,
}

export const createSportEventService = (deps: Deps): SportEventService => {
  const { prisma } = deps

  return {
    getSportEvents: async ({
      keyword,
      city,
      fromDate,
      toDate,
      sportType,
      isCancelled,
    }) => {
      return prisma.sportEvent.findMany({
        where: {
          ...(keyword
            ? {
                name: {
                  contains: keyword,
                },
              }
            : {}),
          ...(sportType
            ? {
                sportTypeId: sportType,
              }
            : {}),
          ...(city
            ? {
                addressCity: city,
              }
            : {}),
          ...(fromDate && toDate
            ? {
                OR: {
                  startAt: {
                    gte: fromDate,
                    lte: toDate,
                  },
                  endAt: {
                    gte: fromDate,
                    lte: toDate,
                  },
                },
              }
            : {}),
          ...(isCancelled
            ? { cancelledAt: { not: null } }
            : { cancelledAt: null }),
        },
        select: sportEventSelect,
      })
    },

    getSportEvent: async ({ id, userId }) => {
      const sportEvent = await prisma.sportEvent.findFirst({
        where: { id },
        select: sportEventSelect,
      })

      if (!sportEvent) {
        return null
      }

      const hasJoined =
        sportEvent.participants.filter(
          (participant) => participant.id === userId,
        ).length === 1

      return {
        ...sportEvent,
        isCreator: sportEvent.hostId === userId,
        hasJoined,
      }
    },

    getPeople: async ({ id }) => {
      const event = await prisma.sportEvent.findFirst({
        where: { id },
        select: {
          participants: {
            select: userSelect,
          },
        },
      })

      if (!event?.participants)
        throw createErrorWithMessage(
          InternalStatus.NOT_FOUND,
          StatusCodes.NOT_FOUND,
          'Event not found',
        )

      return event?.participants
    },

    createSportEvent: async ({ sportEvent }) => {
      await prisma.sportEvent.create({
        data: {
          ...sportEvent,
          id: nanoid(),
          createdAt: new Date(),
        },
      })
    },

    updateSportEvent: async ({ id, sportEvent }) => {
      await prisma.sportEvent.update({
        where: { id },
        data: {
          ...sportEvent,
          updatedAt: new Date(),
        },
      })
    },

    joinEvent: async ({ id, userId }) => {
      const isMyEvent = await prisma.sportEvent.findFirst({
        where: { id, hostId: userId },
      })

      if (isMyEvent !== null)
        throw createErrorWithMessage(
          InternalStatus.BODY_VALIDATION,
          StatusCodes.BAD_REQUEST,
          'Unable to join to your own event',
        )

      await prisma.sportEvent.update({
        data: {
          participants: {
            connect: {
              id: userId,
            },
          },
        },
        where: {
          id,
        },
      })
    },

    cancelJoinEvent: async ({ id, userId }) => {
      const joinedEvent = await prisma.sportEvent.findFirst({
        where: {
          id,
          participants: {
            some: {
              id: userId,
            },
          },
        },
      })

      if (joinedEvent === null)
        throw createErrorWithMessage(
          InternalStatus.BODY_VALIDATION,
          StatusCodes.BAD_REQUEST,
          "You haven't joined this event yet",
        )

      await prisma.sportEvent.update({
        data: {
          participants: {
            disconnect: {
              id: userId,
            },
          },
        },
        where: {
          id,
        },
      })
    },

    cancelSportEvent: async ({ id }) => {
      await prisma.sportEvent.update({
        where: { id },
        data: {
          cancelledAt: new Date(),
        },
      })
    },

    deleteSportEvent: async ({ id }) => {
      await prisma.sportEvent.delete({ where: { id } })
    },
  }
}
