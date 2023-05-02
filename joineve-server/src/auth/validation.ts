import { z } from 'zod'

export const loginBodySchema = z.object({
  email: z
    .string()
    .email()
    .trim()
    .nonempty({ message: 'Email cannot be empty' }),
  password: z.string().trim().nonempty({ message: 'Password cannot be empty' }),
})

export type LoginBodySchema = z.infer<typeof loginBodySchema>

export const registerBodySchema = z
  .object({
    name: z
      .string()
      .trim()
      .nonempty({ message: 'Name cannot be empty' })
      .max(255),
    email: z
      .string()
      .email()
      .trim()
      .nonempty({ message: 'Email cannot be empty' }),
    password: z
      .string()
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
        'Minimum 8 character, combination of lowercase, uppercase, and numbers, and one unique character',
      ),
    confirmPassword: z.string(),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Password confirmation doesn't match",
    path: ['confirmPassword'],
  })

export type RegisterBodySchema = z.infer<typeof registerBodySchema>

export const validateOtpCodeBodySchema = z.object({
  email: z.string().email(),
  code: z.string(),
})

export type ValidateOtpCodeBodySchema = z.infer<
  typeof validateOtpCodeBodySchema
>

export const resendOtpCodeBodySchema = z.object({
  email: z.string().email(),
})

export type ResendOtpCodeBodySchema = z.infer<typeof resendOtpCodeBodySchema>

export const forgetPasswordBodySchema = z.object({
  email: z
    .string()
    .email()
    .trim()
    .nonempty({ message: 'Email cannot be empty' }),
})

export type ForgetPasswordBodySchema = z.infer<typeof forgetPasswordBodySchema>

export const checkForgetPasswordCodeBodySchema = z.object({
  code: z.string().trim(),
})

export type CheckForgetPasswordCodeBodySchema = z.infer<
  typeof checkForgetPasswordCodeBodySchema
>

export const resetPasswordWithCodeBodySchema = z
  .object({
    code: z.string().trim(),
    password: z
      .string()
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
        'Minimum 8 character, combination of lowercase, uppercase, and numbers, and one unique character',
      ),
    confirmPassword: z
      .string()
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
        'Minimum 8 character, combination of lowercase, uppercase, and numbers, and one unique character',
      ),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Password confirmation doesn't match",
    path: ['confirmPassword'],
  })

export type ResetPasswordWithCodeBodySchema = z.infer<
  typeof resetPasswordWithCodeBodySchema
>

export const updatePasswordBodySchema = z
  .object({
    currentPassword: z
      .string()
      .trim()
      .nonempty({ message: 'Current password cannot be empty' }),
    newPassword: z
      .string()
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
        'Minimum 8 character, combination of lowercase, uppercase, and numbers, and one unique character',
      ),
    confirmPassword: z
      .string()
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
        'Minimum 8 character, combination of lowercase, uppercase, and numbers, and one unique character',
      ),
  })
  .refine(
    ({ newPassword, confirmPassword }) => newPassword === confirmPassword,
    {
      message: "Password confirmation doesn't match",
      path: ['confirmPassword'],
    },
  )

export type UpdatePasswordBodySchema = z.infer<typeof updatePasswordBodySchema>
