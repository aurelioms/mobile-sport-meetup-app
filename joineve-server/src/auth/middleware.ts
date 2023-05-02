import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'

import { createErrorWithMessage, InternalStatus } from './../error'
import { Middleware } from './../middleware'
import { AuthService } from './service'

type AuthorizeMiddlewareDeps = {
  authService: AuthService
}

export const createAuthorizeMiddleware =
  (deps: AuthorizeMiddlewareDeps) => (): Middleware => {
    const { authService } = deps

    return async (req: Request, _: Response, next: NextFunction) => {
      try {
        const bearerToken = req.headers['authorization']

        if (!bearerToken) {
          throw createErrorWithMessage(
            InternalStatus.UNAUTHORIZED,
            StatusCodes.UNAUTHORIZED,
            'Please login',
          )
        }

        const token = bearerToken?.split(' ')[1]

        if (!token) {
          throw createErrorWithMessage(
            InternalStatus.UNAUTHORIZED,
            StatusCodes.UNAUTHORIZED,
            'Token invalid',
          )
        }

        try {
          const { user } = await authService.authorize({ token })
          req.user = user
        } catch (error) {
          if (
            error instanceof JsonWebTokenError ||
            error instanceof TokenExpiredError
          ) {
            throw createErrorWithMessage(
              InternalStatus.UNAUTHORIZED,
              StatusCodes.UNAUTHORIZED,
              'Please login, session expired!',
            )
          }
          throw error
        }
        next()
      } catch (error) {
        next(error)
      }
    }
  }
