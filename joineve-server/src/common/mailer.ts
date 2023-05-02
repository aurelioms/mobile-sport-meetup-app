import { createTransport } from 'nodemailer'

import { ENV } from '../env'

type MailData = {
  subject: string
  html: string
}

export type MailClient = {
  send: (recipient: string, data: MailData) => Promise<void>
}

export const createMailClient: () => MailClient = () => {
  const transporter = createTransport({
    service: 'gmail',
    auth: {
      user: ENV.SYSTEM_EMAIL_ADDRESS,
      pass: ENV.SYSTEM_EMAIL_PASSWORD,
    },
  })

  return {
    send: async (recipient, data) => {
      await transporter.sendMail({
        to: recipient,
        from: ENV.SYSTEM_EMAIL_ADDRESS,
        ...data,
      })
    },
  }
}
