import { PrismaClient } from '@prisma/client'
import { nanoid } from 'nanoid'
import bcrypt, { compare } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { MailClient } from '../common/mailer'
import {
  createErrorWithMessage,
  createFieldError,
  InternalStatus,
} from '../error'
import { StatusCodes } from 'http-status-codes'
import { ENV } from '../env'
import { User } from './types'

type Deps = {
  mailer: MailClient
  prisma: PrismaClient
}

type LoginParams = {
  email: string
  password: string
}

type AuthorizeParams = {
  token: string
}

type AuthorizeReturn = {
  user: Omit<User, 'password'>
}

type LoginReturn = {
  token: string
}

type RegisterParams = {
  name: string
  email: string
  password: string
}

type ValidateOtpCodeParams = {
  email: string
  code: string
}

type ResendOtpCodeParams = {
  email: string
}

type ForgetPasswordParams = {
  email: string
}

type CheckForgetPasswordCodeParams = {
  code: string
}

type ResetPasswordWithCodeParams = {
  code: string
  password: string
}

type UpdatePasswordParams = {
  userId: string
  currentPassword: string
  newPassword: string
}

export type AuthService = {
  authorize: (params: AuthorizeParams) => Promise<AuthorizeReturn>
  login: (params: LoginParams) => Promise<LoginReturn>
  register: (params: RegisterParams) => Promise<void>
  validateOtpCode: (params: ValidateOtpCodeParams) => Promise<void>
  resendOtpCode: (params: ResendOtpCodeParams) => Promise<void>
  forgetPassword: (params: ForgetPasswordParams) => Promise<void>
  checkForgetPasswordCode: (
    params: CheckForgetPasswordCodeParams,
  ) => Promise<void>
  resetPasswordWithCode: (params: ResetPasswordWithCodeParams) => Promise<void>
  updatePassword: (params: UpdatePasswordParams) => Promise<void>
}

export const createAuthService = (deps: Deps): AuthService => {
  const { mailer, prisma } = deps

  return {
    authorize: async ({ token }) => {
      const payload = jwt.verify(token, ENV.JWT_SECRET) as { user: string }

      const { user: userPayload } = payload

      const userId = userPayload.split('.')[0]

      const user = await prisma.user.findFirst({
        select: {
          id: true,
          email: true,
          name: true,
          birthDate: true,
          gender: true,
          profileImagePath: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
        },
        where: {
          id: userId,
        },
      })

      if (!user) {
        throw createErrorWithMessage(
          InternalStatus.UNAUTHORIZED,
          StatusCodes.UNAUTHORIZED,
          'Login session expired',
        )
      }

      return { user }
    },

    login: async ({ email, password }) => {
      const user = await prisma.user.findFirst({
        where: {
          email,
        },
      })

      if (!user) {
        throw createFieldError(InternalStatus.BODY_VALIDATION, [
          {
            key: 'email',
            message: 'Email not found.',
          },
        ])
      }

      if (!user.isVerified) {
        const now = new Date()

        const code = Math.floor(100000 + Math.random() * 900000)

        await prisma.otpCode.create({
          data: {
            id: nanoid(),
            userId: user.id,
            code: String(code),
            createdAt: now,
            updatedAt: now,
            expiredAt: new Date(now.getTime() + 5 * 60000),
          },
        })

        await mailer.send(email, {
          subject: 'SportMeetup Registration OTP',
          html: `
            <p>Hello ${user.name}. Thank you for registering on SportMeetup.</p>
            <p>Here is your OTP ${code}</p>
          `,
        })

        throw createErrorWithMessage(
          InternalStatus.UNAUTHORIZED,
          StatusCodes.UNAUTHORIZED,
          'Account is not verified. A new OTP has been sent to your email.',
        )
      }

      if (!bcrypt.compareSync(password, user.password)) {
        throw createFieldError(InternalStatus.BODY_VALIDATION, [
          {
            key: 'password',
            message: 'Password is incorrect.',
          },
        ])
      }

      const payload = {
        user: `${user.id}.${nanoid()}`,
      }

      const token = jwt.sign(payload, ENV.JWT_SECRET, {
        expiresIn: '1y',
      })

      return {
        token,
      }
    },

    register: async ({ name, email, password }) => {
      const user = await prisma.user.findFirst({
        where: {
          email,
        },
      })

      if (user) {
        throw createFieldError(InternalStatus.BODY_VALIDATION, [
          {
            key: 'email',
            message: 'Email has been registered.',
          },
        ])
      }

      const now = new Date()

      const code = Math.floor(100000 + Math.random() * 900000)

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      await prisma.user.create({
        data: {
          id: nanoid(),
          email,
          name,
          password: hashedPassword,
          otpCode: {
            create: [
              {
                id: nanoid(),
                code: String(code),
                createdAt: now,
                updatedAt: now,
                expiredAt: new Date(now.getTime() + 5 * 60000),
              },
            ],
          },
          createdAt: now,
          updatedAt: now,
        },
      })

      await mailer.send(email, {
        subject: 'SportMeetup Registration OTP',
        html: `
          <p>Hello ${name}. Thank you for registering account on SportMeetup.</p>
          <p>Here is your OTP ${code}</p>
        `,
      })
    },

    validateOtpCode: async ({ email, code }) => {
      const otpCode = await prisma.otpCode.findFirst({
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
        where: {
          user: {
            email,
          },
        },
      })

      const now = new Date()

      if (
        !otpCode ||
        otpCode.code !== code ||
        now.getTime() > otpCode.expiredAt.getTime()
      ) {
        throw createErrorWithMessage(
          InternalStatus.VALIDATION_ERROR,
          StatusCodes.BAD_REQUEST,
          'Code is either not valid or has expired',
        )
      }

      await prisma.user.update({
        where: {
          id: otpCode.user.id,
        },
        data: {
          isVerified: true,
          updatedAt: now,
        },
      })
    },

    resendOtpCode: async ({ email }) => {
      const user = await prisma.user.findFirst({
        where: {
          email,
        },
      })

      if (!user) {
        throw createFieldError(InternalStatus.BODY_VALIDATION, [
          {
            key: 'email',
            message: "Email doesn't not exist",
          },
        ])
      }

      const now = new Date()
      const code = Math.floor(100000 + Math.random() * 900000)

      await prisma.otpCode.create({
        data: {
          id: nanoid(),
          userId: user.id,
          code: String(code),
          createdAt: now,
          updatedAt: now,
          expiredAt: new Date(now.getTime() + 5 * 60000),
        },
      })

      await mailer.send(email, {
        subject: 'SportMeetup Registration OTP',
        html: `
          <p>Hello ${user.name}. Thank you for registering account on SportMeetup.</p>
          <p>Here is your OTP ${code}</p>
        `,
      })
    },

    forgetPassword: async ({ email }) => {
      const user = await prisma.user.findFirst({
        where: {
          email,
        },
      })

      if (!user) {
        throw createFieldError(InternalStatus.BODY_VALIDATION, [
          {
            key: 'email',
            message: "Email doesn't not exist",
          },
        ])
      }

      if (!user.isVerified) {
        throw createErrorWithMessage(
          InternalStatus.UNAUTHORIZED,
          StatusCodes.UNAUTHORIZED,
          'Account is not verified. Login to get the verification link.',
        )
      }

      const now = new Date()
      const code = Math.floor(100000 + Math.random() * 900000)

      await prisma.otpCode.create({
        data: {
          id: nanoid(),
          userId: user.id,
          code: String(code),
          createdAt: now,
          updatedAt: now,
          expiredAt: new Date(now.getTime() + 15 * 60000),
        },
      })

      await mailer.send(email, {
        subject: 'SportMeetup Forget Password OTP',
        html: `
          <p>Hello ${user.name}. This is your forget password OTP.</p>
          <p>Here is your OTP ${code}</p>
          <p>Thank you!</p>
        `,
      })
    },

    checkForgetPasswordCode: async ({ code }) => {
      const otpCode = await prisma.otpCode.findFirst({
        include: {
          user: true,
        },
        where: {
          code,
        },
      })

      const now = new Date()

      if (
        !otpCode ||
        otpCode.code !== code ||
        now.getTime() > otpCode.expiredAt.getTime()
      ) {
        throw createErrorWithMessage(
          InternalStatus.VALIDATION_ERROR,
          StatusCodes.BAD_REQUEST,
          'Code is either not valid or expire',
        )
      }
    },

    resetPasswordWithCode: async ({ code, password }) => {
      const otpCode = await prisma.otpCode.findFirst({
        include: {
          user: true,
        },
        where: {
          code,
        },
      })

      const now = new Date()

      if (
        !otpCode ||
        otpCode.code !== code ||
        now.getTime() > otpCode.expiredAt.getTime()
      ) {
        throw createErrorWithMessage(
          InternalStatus.VALIDATION_ERROR,
          StatusCodes.BAD_REQUEST,
          'Code is either not valid or expire',
        )
      }

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      await prisma.user.update({
        where: {
          id: otpCode.user.id,
        },
        data: {
          password: hashedPassword,
          updatedAt: now,
        },
      })
    },

    updatePassword: async ({ userId, newPassword, currentPassword }) => {
      const now = new Date()
      const salt = await bcrypt.genSalt(10)

      const user = await prisma.user.findFirst({ where: { id: userId } })

      if (!user)
        throw createErrorWithMessage(
          InternalStatus.VALIDATION_ERROR,
          StatusCodes.BAD_REQUEST,
          'User not found',
        )

      const isPasswordSame = await compare(currentPassword, user.password)

      if (!isPasswordSame)
        throw createFieldError(InternalStatus.BODY_VALIDATION, [
          {
            key: 'currentPassword',
            message: "Current password doesn't match",
          },
        ])

      const hashedPassword = await bcrypt.hash(newPassword, salt)

      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          password: hashedPassword,
          updatedAt: now,
        },
      })
    },
  }
}
