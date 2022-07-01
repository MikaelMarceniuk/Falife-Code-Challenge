import userController from './user.controller'
import { Application } from 'express'

export default (app: Application, prefix: string) => {
  app.get(`${prefix}/user`, userController.findAll)
  app.get(`${prefix}/user/:id`, userController.findOne)
  app.post(`${prefix}/user`, userController.create)
  app.patch(`${prefix}/user/:id`, userController.update)
  app.delete(`${prefix}/user/:id`, userController.delete)
}
