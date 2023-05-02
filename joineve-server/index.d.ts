import 'express-serve-static-core'
import { User } from './src/auth/types'

declare global {
  namespace Express {
    interface Request {
      zodParsedBody: unknown
      zodParsedQuery: unknown
      zodParsedParams: unknown
      user: Omit<User, 'password'>
    }
  }
}
