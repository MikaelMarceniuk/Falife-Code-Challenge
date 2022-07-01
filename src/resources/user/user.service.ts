import { IsNull } from 'typeorm'
import { User } from '../../entities/User.entity'
import userRepository from './user.repository'

export default {
  findAll: async () => {
    return await userRepository.findAll()
  },

  findOne: async (userId: string) => {
    return await userRepository.findOneByUserId(userId)
  },

  create: async (newUser: any) => {
    // Validates if email is not used
    const dbUserByEmail = await userRepository.findOneByEmail(
      newUser.email,
      true
    )

    if (dbUserByEmail) {
      return dbUserByEmail?.deletedAt
        ? 'Account is deleted'
        : 'Email already registered'
    }

    // Creates user
    let dbNewUser = new User()
    dbNewUser.name = newUser.name
    dbNewUser.email = newUser.email
    dbNewUser.password = newUser.password
    dbNewUser = await userRepository.save(dbNewUser)

    return dbNewUser
  },

  update: async (userId: string, user: any) => {
    const dbUser = await userRepository.findOneByUserId(userId)
    if (!dbUser) return 'User not found'

    dbUser.name = user.name
    dbUser.email = user.email
    dbUser.password = user.password

    await userRepository.update(dbUser)
  },

  softDelete: async (userId: string) => {
    await userRepository.softDelete(userId)
  }
}
