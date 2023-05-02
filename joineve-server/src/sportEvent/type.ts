import { SportEvent as PrismaSportEvent, User, SportType } from '@prisma/client'

export type EventUser = Omit<User, 'password' | 'gender' | 'birthDate'>

export type SportEvent = PrismaSportEvent & {
  host: EventUser
  sportType: SportType | null
  participants: EventUser[]
}

export type SportEventData = Omit<
  PrismaSportEvent,
  'id' | 'createdAt' | 'updatedAt' | 'longitude' | 'latitude' | 'cancelledAt'
> & {
  longitude: number
  latitude: number
  cancelledAt?: Date
}
