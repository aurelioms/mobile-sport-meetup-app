import { Handler } from '../handler'
import { withValidation } from '../validation'
import { UserService } from './service'
import { UpdateProfileBodySchema, updateProfileBodySchema } from './validation'

type UserHandlerDeps = {
  userService: UserService
}

export const updateProfileHandler = (deps: UserHandlerDeps): Handler =>
  withValidation(
    {
      bodySchema: updateProfileBodySchema,
    },
    async (req, res, next) => {
      try {
        const { userService } = deps

        const { user } = req
        const { name, birthDate, gender, profileImagePath } =
          req.zodParsedBody as UpdateProfileBodySchema

        await userService.updateProfile({
          id: user.id,
          user: { name, birthDate, gender, profileImagePath },
        })

        res.json({
          success: true,
        })
      } catch (error) {
        next(error)
      }
    },
  )

export const getUserJoinedEventsHandler =
  (deps: UserHandlerDeps): Handler =>
  async (req, res, next) => {
    try {
      const { userService } = deps

      const { user } = req

      const events = await userService.getJoinedEvents({
        id: user.id,
      })

      res.json({
        data: events,
      })
    } catch (error) {
      next(error)
    }
  }

export const getUserCreatedEventsHandler =
  (deps: UserHandlerDeps): Handler =>
  async (req, res, next) => {
    try {
      const { userService } = deps

      const { user } = req

      const events = await userService.getCreatedEvents({
        id: user.id,
      })

      res.json({
        data: events,
      })
    } catch (error) {
      next(error)
    }
  }

export const deleteUserHandler =
  (deps: UserHandlerDeps): Handler =>
  async (req, res, next) => {
    try {
      const { userService } = deps

      const { user } = req

      await userService.deleteUser({
        id: user.id,
      })

      res.json({
        success: true,
      })
    } catch (error) {
      next(error)
    }
  }
