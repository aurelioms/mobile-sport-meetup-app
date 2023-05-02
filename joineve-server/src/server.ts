import express from 'express'
import { Express } from 'express'
import cors from 'cors'
import { createRouter } from './router'
import { createExampleService } from './example/service'
import { getIndexListHandler } from './example/handler'
import {
  checkForgetPasswordCodeHandler,
  forgetPasswordHandler,
  getLoggedInUserHandler,
  loginHandler,
  registerHandler,
  resendOtpCodeHandler,
  resetPasswordWithCodeHandler,
  updatePasswordHandler,
  validateOtpCodeHandler,
} from './auth/handler'
import { createMailClient } from './common/mailer'
import { createPrismaClient } from './prisma'
import { createAuthService } from './auth/service'
import { Middleware } from './middleware'
import { createSportEventService } from './sportEvent/service'
import {
  cancelJoinSportEventHandler,
  cancelSportEventHandler,
  createSportEventHandler,
  deleteSportEventHandler,
  getSportEventHandler,
  getSportEventPeopleHandler,
  getSportEventsHandler,
  joinSportEventHandler,
  updateSportEventHandler,
} from './sportEvent/handler'
import { createCommentService } from './comment/service'
import {
  createCommentHandler,
  deleteCommentHandler,
  getCommentsByEventHandler,
  updateCommentHandler,
} from './comment/handler'
import { createAuthorizeMiddleware } from './auth/middleware'
import { createUserService } from './user/service'
import {
  deleteUserHandler,
  getUserCreatedEventsHandler,
  getUserJoinedEventsHandler,
  updateProfileHandler,
} from './user/handler'
import { mediaUploadHandler, mediaPath } from './common/multer'
import { createSportTypeService } from './sport-type/service'
import { getSportTypeHandler, getSportTypesHandler } from './sport-type/handler'

export type Server = Express

const mailer = createMailClient()
const prisma = createPrismaClient()

const exampleService = createExampleService({})
const userService = createUserService({ prisma })
const commentService = createCommentService({ prisma })
const authService = createAuthService({ mailer, prisma })
const sportEventService = createSportEventService({ prisma })
const sportTypeService = createSportTypeService({ prisma })

const authorizeMiddleware = createAuthorizeMiddleware({ authService })

export const createServer = (): Server => {
  return express().use(cors()).use(express.json())
}

export const startServer = async (server: Server, port: number) =>
  server.listen(port, () => {
    console.log(`Server running on localhost:${port}`)
  })

export const initializeRoutes = (server: Server) => {
  const appRouter = createRouter()

  const exampleRouter = createExampleRouter()
  const authRouter = createAuthRouter()
  const sportEventRouter = createSportEventRouter()
  const sportTypeRouter = createSportTypeRouter()
  const commentRouter = createCommentRouter()
  const userRouter = createUserRouter()

  appRouter.use('/files', express.static(mediaPath))
  appRouter.post('/file', authorizeMiddleware(), mediaUploadHandler)
  appRouter.use('/example', exampleRouter)
  appRouter.use('/auth', authRouter)
  appRouter.use('/sport-event', sportEventRouter)
  appRouter.use('/sport-event/comment', commentRouter)
  appRouter.use('/sport-type', sportTypeRouter)
  appRouter.use('/user', userRouter)

  server.use('/api/v1', appRouter)

  console.log('Initialize routes')
}

export const createExampleRouter = () => {
  return createRouter().get('/', getIndexListHandler({ exampleService }))
}

export const createAuthRouter = () => {
  const deps = { authService }

  return createRouter()
    .get('/', authorizeMiddleware(), getLoggedInUserHandler())
    .post(
      '/update-password',
      authorizeMiddleware(),
      updatePasswordHandler(deps),
    )
    .post('/register', registerHandler(deps))
    .post('/validate-otp', validateOtpCodeHandler(deps))
    .post('/resend-otp', resendOtpCodeHandler(deps))
    .post('/login', loginHandler(deps))
    .post('/forget-password', forgetPasswordHandler(deps))
    .post('/check-forget-password-code', checkForgetPasswordCodeHandler(deps))
    .post('/reset-password', resetPasswordWithCodeHandler(deps))
}

export const createSportTypeRouter = () => {
  const deps = { sportTypeService }

  return createRouter()
    .get('/', authorizeMiddleware(), getSportTypesHandler(deps))
    .get('/:id', authorizeMiddleware(), getSportTypeHandler(deps))
}

export const createSportEventRouter = () => {
  const deps = { sportEventService }

  return createRouter()
    .get('/', authorizeMiddleware(), getSportEventsHandler(deps))
    .get('/:id/people', authorizeMiddleware(), getSportEventPeopleHandler(deps))
    .get('/:id', authorizeMiddleware(), getSportEventHandler(deps))
    .post('/', authorizeMiddleware(), createSportEventHandler(deps))
    .post('/:id/join', authorizeMiddleware(), joinSportEventHandler(deps))
    .post(
      '/:id/cancel-join',
      authorizeMiddleware(),
      cancelJoinSportEventHandler(deps),
    )
    .put('/:id/cancel', authorizeMiddleware(), cancelSportEventHandler(deps))
    .put('/:id', authorizeMiddleware(), updateSportEventHandler(deps))
    .delete('/:id', authorizeMiddleware(), deleteSportEventHandler(deps))
}

export const createCommentRouter = () => {
  const deps = { commentService }

  return createRouter()
    .get(
      '/:sportEventId',
      authorizeMiddleware(),
      getCommentsByEventHandler(deps),
    )
    .post('/:sportEventId', authorizeMiddleware(), createCommentHandler(deps))
    .put(
      '/:sportEventId/:id',
      authorizeMiddleware(),
      updateCommentHandler(deps),
    )
    .delete(
      '/:sportEventId/:id',
      authorizeMiddleware(),
      deleteCommentHandler(deps),
    )
}

export const createUserRouter = () => {
  const deps = { userService }

  return createRouter()
    .get(
      '/joined-events',
      authorizeMiddleware(),
      getUserJoinedEventsHandler(deps),
    )
    .get(
      '/created-events',
      authorizeMiddleware(),
      getUserCreatedEventsHandler(deps),
    )
    .put('/update-profile', authorizeMiddleware(), updateProfileHandler(deps))
    .delete('/delete', authorizeMiddleware(), deleteUserHandler(deps))
}

export const installMiddleware = (server: Server, middleware: Middleware) => {
  server.use(middleware)
}
