import { Request, Response, NextFunction } from 'express'

export type Middleware =
  | ((error: any, req: Request, res: Response, next: NextFunction) => void)
  | ((req: Request, res: Response, next: NextFunction) => void)
