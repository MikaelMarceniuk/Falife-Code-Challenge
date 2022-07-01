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
    const body = req.body
    const newUser = await userService.create(body)

    res.json(newUser)
  },

  update: async (req: any, res: any) => {
    const userId = req.params.id
    const body = req.body
    await userService.update(userId, body)

    res.json()
  },

  delete: async (req: any, res: any) => {
    await userService.softDelete(req.params.id)

    res.json()
  }
}
