export const ENV = {
  PORT: parseInt(process.env.PORT as string),
  SYSTEM_EMAIL_ADDRESS: process.env.SYSTEM_EMAIL_ADDRESS as string,
  SYSTEM_EMAIL_PASSWORD: process.env.SYSTEM_EMAIL_PASSWORD as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  FILE_DIRECTORY: process.env.FILE_DIRECTORY as string,
}
