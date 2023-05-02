import { StatusCodes } from 'http-status-codes'
import { Handler } from '../handler'
import { ExampleService } from './service'

type GetIndexListHandlerDeps = {
  exampleService: ExampleService
}

export const getIndexListHandler =
  (deps: GetIndexListHandlerDeps): Handler =>
  async (req, res, next) => {
    const { exampleService } = deps

    try {
      const data = await exampleService.getIndexList()

      return res.status(StatusCodes.OK).json({
        data,
      })
    } catch (error) {
      next(error)
    }
  }
