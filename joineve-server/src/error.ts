import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { Middleware } from './middleware'

export { StatusCodes }

export enum InternalStatus {
  UNKNOWN,
  BODY_VALIDATION,
  VALIDATION_ERROR,
  NOT_FOUND,
  UNAUTHORIZED,
  FORBIDDEN,
  FORGOT_PASSWORD_CODE_EXPIRED,
}

type Field = {
  key: string
  message: string
}

export abstract class CustomError extends Error {
  internalStatus: InternalStatus
  status: StatusCodes

  constructor(internalStatus: InternalStatus, status: StatusCodes) {
    super('')
    this.internalStatus = internalStatus
    this.status = status
  }

  abstract toJSON(): Record<string, unknown>
}

class ErrorWithMessage extends CustomError {
  native?: Error

  constructor(
    internalStatus: InternalStatus,
    status: StatusCodes,
    message: string,
    error?: Error,
  ) {
    super(internalStatus, status)
    this.message = message
    this.native = error
  }

  toJSON(): Record<string, unknown> {
    return {
      status: this.internalStatus,
      error: {
        message: this.message,
      },
    }
  }
}

class FieldError extends CustomError {
  fields: Field[]

  constructor(internalStatus: InternalStatus, fields: Field[]) {
    super(internalStatus, StatusCodes.BAD_REQUEST)
    this.fields = fields
  }

  toJSON(): Record<string, unknown> {
    return {
      status: this.internalStatus,
      error: {
        fields: this.fields,
      },
    }
  }
}

export const createErrorWithMessage = (
  internalStatus: InternalStatus,
  status: StatusCodes,
  message: string,
  error?: Error,
): CustomError => {
  return new ErrorWithMessage(internalStatus, status, message, error)
}

export const createFieldError = (
  internalStatus: InternalStatus,
  fields: Field[],
): CustomError => {
  return new FieldError(internalStatus, fields)
}

export const createInternalError = (error: Error) => {
  return createErrorWithMessage(
    InternalStatus.UNKNOWN,
    StatusCodes.INTERNAL_SERVER_ERROR,
    'Internal server error',
    error,
  )
}

export const errorHandlerMiddleware: Middleware = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error(error)

  if (error instanceof CustomError)
    return res.status(error.status).json(error.toJSON())

  const defaultError = createErrorWithMessage(
    InternalStatus.UNKNOWN,
    StatusCodes.INTERNAL_SERVER_ERROR,
    'Terjadi kesalahan pada server',
  )

  return res.status(defaultError.status).json(defaultError.toJSON())
}
