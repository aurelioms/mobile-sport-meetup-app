import { PrismaClient } from '@prisma/client'
import { nanoid } from 'nanoid'

const sportTypes = [
  'Football',
  'Futsal',
  'Basketball',
  'Volleyball',
  'Baseball',
  'Rugby',
  'Cricket',
]

const prisma = new PrismaClient()

const generateSportTypes = async () => {
  await Promise.all(
    sportTypes.map(async (sportType) => {
      const isSportTypeExist =
        (await prisma.sportType.findFirst({
          where: { name: sportType },
        })) !== null

      if (!isSportTypeExist) {
        const now = new Date()

        await prisma.sportType.create({
          data: {
            id: nanoid(),
            name: sportType,
            createdAt: now,
            updatedAt: now,
          },
        })
      }
    }),
  )
}

const main = async () => {
  await generateSportTypes()
}

main()
  .then()
  .catch()
  .finally(() => prisma.$disconnect())
