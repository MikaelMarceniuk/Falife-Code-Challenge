import { Request } from 'express'
import CreateUserDTO from './dto/create-user.dto'
import userService from './user.service'

export default {
  findAll: async (req: any, res: any) => {
    const dbUsers = await userService.findAll()
    res.json(dbUsers)
  },

  findOne: async (req: any, res: any) => {
    const userId = req.params.id
    const dbUser = await userService.findOne(userId)
    res.json(dbUser)
  },

  create: async (req: any, res: any) => {
    const body: CreateUserDTO = req.body
    const newUser = await userService.create(body)

    res.json(newUser)
  },

  update: async (req: Request, res: any) => {
    const userId = req.params.id
    const body = req.body
    const response = await userService.update(userId, body)

    response ? res.json(response) : res.status(204)
  },

  delete: async (req: Request, res: any) => {
    const resp = await userService.delete(
      req.params.id,
      req.query.soft as string
    )

    res.send(resp)
  }
}
