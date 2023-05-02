import { errorHandlerMiddleware } from './error'
import 'dotenv/config'

import { ENV } from './env'
import {
  createServer,
  initializeRoutes,
  installMiddleware,
  startServer,
} from './server'

const server = createServer()

initializeRoutes(server)
installMiddleware(server, errorHandlerMiddleware)

startServer(server, ENV.PORT)
