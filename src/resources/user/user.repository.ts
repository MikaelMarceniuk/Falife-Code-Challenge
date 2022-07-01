import { IsNull, Not } from 'typeorm'
import configs from '../../configs'
import { User } from '../../entities/User.entity'

const userRepo = configs.dbDataSource.getRepository(User)

export default {
  findAll: async () => {
    return await userRepo.findAndCount()
  },

  findOneByUserId: async (id: string) => {
    return await userRepo.findOneBy({ id })
  },

  findOneByEmail: async (email: string, withDeleted?: boolean) => {
    return await userRepo.findOne({
      where: {
        email
      },
      withDeleted
    })
  },

  save: async (user: User) => {
    return await userRepo.save(user)
  },

  restoreSoftDelete: async (userId: string) => {
    return await userRepo.restore(userId)
  },

  update: async (user: User) => {
    return await userRepo.update(user.id, user)
  },

  softDelete: async (id: string) => {
    return await userRepo.softDelete(id)
  }
}
