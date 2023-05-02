import { PrismaClient } from '@prisma/client'
import { SportType } from './type'

type Deps = {
  prisma: PrismaClient
}

type GetSportTypeParams = { id: string }

export type SportTypeService = {
  getSportTypes: () => Promise<SportType[]>
  getSportType: (params: GetSportTypeParams) => Promise<SportType | null>
}

export const sportTypeSelect = {
  id: true,
  name: true,
  createdAt: true,
  updatedAt: true,
}

export const createSportTypeService = (deps: Deps): SportTypeService => {
  const { prisma } = deps

  return {
    getSportTypes: async () => {
      return prisma.sportType.findMany({
        select: sportTypeSelect,
      })
    },

    getSportType: async ({ id }) => {
      return prisma.sportType.findFirst({
        where: { id },
        select: sportTypeSelect,
      })
    },
  }
}
