import { Application } from 'express'
import userRouter from './resources/user/user.router'

const v1ApiPrefix = '/api/v1'

const routers = [{ router: userRouter, prefix: v1ApiPrefix }]

export default (app: Application) => {
  routers.forEach(({ router, prefix }) => router(app, prefix))
}
