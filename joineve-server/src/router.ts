import express from 'express'
import type { Router as ExpressRouter } from 'express'

export type Router = ExpressRouter

export const createRouter = (): Router => express.Router()
