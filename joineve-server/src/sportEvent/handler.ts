import { Handler } from '../handler'
import { withValidation } from '../validation'
import { SportEventService } from './service'
import {
  cancelJoinSportEventParamsSchema,
  CancelJoinSportEventParamsSchema,
  CancelSportEventParamsSchema,
  cancelSportEventParamsSchema,
  CreateSportEventBodySchema,
  createSportEventBodySchema,
  DeleteSportEventParamsSchema,
  deleteSportEventParamsSchema,
  GetSportEventParamsSchema,
  getSportEventParamsSchema,
  GetSportEventPeopleParamsSchema,
  getSportEventPeopleParamsSchema,
  GetSportEventsParamsSchema,
  getSportEventsParamsSchema,
  JoinSportEventParamsSchema,
  joinSportEventParamsSchema,
  UpdateSportEventBodySchema,
  updateSportEventBodySchema,
  updateSportEventParamsSchema,
  UpdateSportEventParamsSchema,
} from './validation'

type SportEventHandler = {
  sportEventService: SportEventService
}

export const getSportEventsHandler = (deps: SportEventHandler): Handler =>
  withValidation(
    {
      querySchema: getSportEventsParamsSchema,
    },
    async (req, res, next) => {
      try {
        const { sportEventService } = deps
        const filter = req.zodParsedQuery as GetSportEventsParamsSchema

        const sportEvents = await sportEventService.getSportEvents(filter)

        return res.json({ data: sportEvents })
      } catch (error) {
        next(error)
      }
    },
  )

export const getSportEventHandler = (deps: SportEventHandler): Handler =>
  withValidation(
    {
      paramsSchema: getSportEventParamsSchema,
    },
    async (req, res, next) => {
      try {
        const { sportEventService } = deps
        const { id } = req.zodParsedParams as GetSportEventParamsSchema
        const { id: userId } = req.user

        const sportEvents = await sportEventService.getSportEvent({
          id,
          userId,
        })

        return res.json({ data: sportEvents })
      } catch (error) {
        next(error)
      }
    },
  )

export const getSportEventPeopleHandler = (deps: SportEventHandler): Handler =>
  withValidation(
    {
      paramsSchema: getSportEventPeopleParamsSchema,
    },
    async (req, res, next) => {
      try {
        const { sportEventService } = deps
        const { id } = req.zodParsedParams as GetSportEventPeopleParamsSchema

        const sportEvents = await sportEventService.getPeople({ id })

        return res.json({ data: sportEvents })
      } catch (error) {
        next(error)
      }
    },
  )

export const createSportEventHandler = (deps: SportEventHandler): Handler =>
  withValidation(
    {
      bodySchema: createSportEventBodySchema,
    },
    async (req, res, next) => {
      try {
        const { sportEventService } = deps
        const sportEvent = req.zodParsedBody as CreateSportEventBodySchema

        await sportEventService.createSportEvent({
          sportEvent: {
            ...sportEvent,
            hostId: req.user.id,
            latitude: Number(sportEvent.latitude),
            longitude: Number(sportEvent.longitude),
          },
        })

        return res.json({ success: true })
      } catch (error) {
        next(error)
      }
    },
  )

export const updateSportEventHandler = (deps: SportEventHandler): Handler =>
  withValidation(
    {
      paramsSchema: updateSportEventParamsSchema,
      bodySchema: updateSportEventBodySchema,
    },
    async (req, res, next) => {
      try {
        const { sportEventService } = deps
        const { id } = req.params as UpdateSportEventParamsSchema

        const sportEvent = req.zodParsedBody as UpdateSportEventBodySchema

        await sportEventService.updateSportEvent({
          id,
          sportEvent: {
            ...sportEvent,
            latitude: Number(sportEvent.latitude),
            longitude: Number(sportEvent.longitude),
          },
        })

        return res.json({ success: true })
      } catch (error) {
        next(error)
      }
    },
  )

export const joinSportEventHandler = (deps: SportEventHandler): Handler =>
  withValidation(
    {
      paramsSchema: joinSportEventParamsSchema,
    },
    async (req, res, next) => {
      try {
        const { sportEventService } = deps

        const { user } = req
        const { id } = req.params as JoinSportEventParamsSchema

        await sportEventService.joinEvent({
          id,
          userId: user.id,
        })

        return res.json({ success: true })
      } catch (error) {
        next(error)
      }
    },
  )

export const cancelJoinSportEventHandler = (deps: SportEventHandler): Handler =>
  withValidation(
    {
      paramsSchema: cancelJoinSportEventParamsSchema,
    },
    async (req, res, next) => {
      try {
        const { sportEventService } = deps

        const { user } = req
        const { id } = req.params as CancelJoinSportEventParamsSchema

        await sportEventService.cancelJoinEvent({
          id,
          userId: user.id,
        })

        return res.json({ success: true })
      } catch (error) {
        next(error)
      }
    },
  )

export const cancelSportEventHandler = (deps: SportEventHandler): Handler =>
  withValidation(
    {
      paramsSchema: cancelSportEventParamsSchema,
    },
    async (req, res, next) => {
      try {
        const { sportEventService } = deps
        const { id } = req.zodParsedParams as CancelSportEventParamsSchema

        await sportEventService.cancelSportEvent({ id })

        return res.json({ success: true })
      } catch (error) {
        next(error)
      }
    },
  )

export const deleteSportEventHandler = (deps: SportEventHandler): Handler =>
  withValidation(
    {
      paramsSchema: deleteSportEventParamsSchema,
    },
    async (req, res, next) => {
      try {
        const { sportEventService } = deps
        const { id } = req.zodParsedParams as DeleteSportEventParamsSchema

        await sportEventService.deleteSportEvent({ id })

        return res.json({ success: true })
      } catch (error) {
        next(error)
      }
    },
  )
