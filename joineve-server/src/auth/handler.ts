import { StatusCodes } from 'http-status-codes'
import { Handler } from '../handler'
import { withValidation } from '../validation'
import { AuthService } from './service'
import {
  CheckForgetPasswordCodeBodySchema,
  checkForgetPasswordCodeBodySchema,
  ForgetPasswordBodySchema,
  forgetPasswordBodySchema,
  LoginBodySchema,
  loginBodySchema,
  RegisterBodySchema,
  registerBodySchema,
  ResendOtpCodeBodySchema,
  resendOtpCodeBodySchema,
  ResetPasswordWithCodeBodySchema,
  resetPasswordWithCodeBodySchema,
  UpdatePasswordBodySchema,
  updatePasswordBodySchema,
  ValidateOtpCodeBodySchema,
  validateOtpCodeBodySchema,
} from './validation'

export const getLoggedInUserHandler = (): Handler => (req, res) => {
  const { user } = req

  return res.status(StatusCodes.OK).json({
    data: user,
  })
}

type LoginHandlerDeps = {
  authService: AuthService
}

export const loginHandler = (deps: LoginHandlerDeps) =>
  withValidation(
    {
      bodySchema: loginBodySchema,
    },
    async (req, res, next) => {
      const { authService } = deps

      try {
        const { email, password } = req.zodParsedBody as LoginBodySchema

        const payload = await authService.login({
          email,
          password,
        })

        return res.status(StatusCodes.OK).json({
          data: payload,
        })
      } catch (error) {
        next(error)
      }
    },
  )

type RegisterHandlerDeps = {
  authService: AuthService
}

export const registerHandler = (deps: RegisterHandlerDeps) =>
  withValidation(
    {
      bodySchema: registerBodySchema,
    },
    async (req, res, next) => {
      const { authService } = deps

      try {
        const { name, email, password } =
          req.zodParsedBody as RegisterBodySchema

        await authService.register({
          name,
          email,
          password,
        })

        return res.status(StatusCodes.OK).json({
          message: 'Register successful',
        })
      } catch (error) {
        next(error)
      }
    },
  )

type ValidateOtpCodeHandlerDeps = {
  authService: AuthService
}

export const validateOtpCodeHandler = (deps: ValidateOtpCodeHandlerDeps) =>
  withValidation(
    {
      bodySchema: validateOtpCodeBodySchema,
    },
    async (req, res, next) => {
      const { authService } = deps

      try {
        const { email, code } = req.zodParsedBody as ValidateOtpCodeBodySchema

        await authService.validateOtpCode({
          email,
          code,
        })

        return res.status(StatusCodes.OK).json({
          message: 'Account verified successful.',
        })
      } catch (error) {
        next(error)
      }
    },
  )

type ResendOtpCodeHandlerDeps = {
  authService: AuthService
}

export const resendOtpCodeHandler = (deps: ResendOtpCodeHandlerDeps) =>
  withValidation(
    {
      bodySchema: resendOtpCodeBodySchema,
    },
    async (req, res, next) => {
      const { authService } = deps

      try {
        const { email } = req.zodParsedBody as ResendOtpCodeBodySchema

        await authService.resendOtpCode({
          email,
        })

        return res.status(StatusCodes.OK).json({
          message: 'New otp code has been sent to your email.',
        })
      } catch (error) {
        next(error)
      }
    },
  )

type ForgetPasswordHandlerDeps = {
  authService: AuthService
}

export const forgetPasswordHandler = (deps: ForgetPasswordHandlerDeps) =>
  withValidation(
    {
      bodySchema: forgetPasswordBodySchema,
    },
    async (req, res, next) => {
      const { authService } = deps

      try {
        const { email } = req.zodParsedBody as ForgetPasswordBodySchema

        await authService.forgetPassword({
          email,
        })

        return res.status(StatusCodes.OK).json({
          message: 'Forget password otp code has been sent to your email.',
        })
      } catch (error) {
        next(error)
      }
    },
  )

type CheckForgetPasswordCodeHandlerDeps = {
  authService: AuthService
}

export const checkForgetPasswordCodeHandler = (
  deps: CheckForgetPasswordCodeHandlerDeps,
) =>
  withValidation(
    {
      bodySchema: checkForgetPasswordCodeBodySchema,
    },
    async (req, res, next) => {
      const { authService } = deps

      try {
        const { code } = req.zodParsedBody as CheckForgetPasswordCodeBodySchema

        await authService.checkForgetPasswordCode({
          code,
        })

        return res.status(StatusCodes.OK).json({
          data: {
            code,
            valid: true,
          },
        })
      } catch (error) {
        next(error)
      }
    },
  )

type ResetPasswordWithCodeHandlerDeps = {
  authService: AuthService
}

export const resetPasswordWithCodeHandler = (
  deps: ResetPasswordWithCodeHandlerDeps,
) =>
  withValidation(
    {
      bodySchema: resetPasswordWithCodeBodySchema,
    },
    async (req, res, next) => {
      try {
        const { authService } = deps

        const { code, password } =
          req.zodParsedBody as ResetPasswordWithCodeBodySchema

        await authService.resetPasswordWithCode({ code, password })

        return res.status(StatusCodes.OK).json({
          success: true,
        })
      } catch (error) {
        next(error)
      }
    },
  )

type UpdatePasswordHandlerDeps = {
  authService: AuthService
}

export const updatePasswordHandler = (deps: UpdatePasswordHandlerDeps) =>
  withValidation(
    {
      bodySchema: updatePasswordBodySchema,
    },
    async (req, res, next) => {
      try {
        const { authService } = deps

        const { newPassword, currentPassword } =
          req.zodParsedBody as UpdatePasswordBodySchema

        await authService.updatePassword({
          userId: req.user.id,
          newPassword,
          currentPassword,
        })

        return res.status(StatusCodes.OK).json({
          success: true,
        })
      } catch (error) {
        next(error)
      }
    },
  )
