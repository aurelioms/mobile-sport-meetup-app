import { SportType as PrismaSportType } from '@prisma/client'

export type SportType = PrismaSportType

export type SportTypeData = Omit<
  PrismaSportType,
  'id' | 'createdAt' | 'updatedAt'
>
