import { Handler } from '../handler'
import { withValidation } from '../validation'
import { SportTypeService } from './service'
import {
  getSportTypeParamsSchema,
  GetSportTypeParamsSchema,
} from './validation'

type SportTypeHandler = {
  sportTypeService: SportTypeService
}

export const getSportTypesHandler =
  (deps: SportTypeHandler): Handler =>
  async (req, res, next) => {
    try {
      const { sportTypeService } = deps

      const sportEvents = await sportTypeService.getSportTypes()

      return res.json({ data: sportEvents })
    } catch (error) {
      next(error)
    }
  }

export const getSportTypeHandler = (deps: SportTypeHandler): Handler =>
  withValidation(
    {
      paramsSchema: getSportTypeParamsSchema,
    },
    async (req, res, next) => {
      try {
        const { sportTypeService } = deps
        const { id } = req.zodParsedParams as GetSportTypeParamsSchema

        const sportEvent = await sportTypeService.getSportType({
          id,
        })

        return res.json({ data: sportEvent })
      } catch (error) {
        next(error)
      }
    },
  )
