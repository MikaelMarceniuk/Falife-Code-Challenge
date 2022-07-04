import { User } from '../../entities/User.entity'
import CreateUserDTO from './dto/create-user.dto'
import userRepository from './user.repository'
import moment from 'moment'
import FindOneUserDTO from './dto/findOne-user.dto'
import ApiResponse from '../../utils/apiResponse'

const calculateAge = (birthday: moment.Moment) => {
  return moment().diff(birthday, 'years')
}

const validateDtNascimento = (birthday: string) => {
  const userDtNascimento = moment(birthday, 'DD-MM-YYYY')
  if (!userDtNascimento.isValid())
    return {
      isValid: false,
      errorMsg: `dtNascimento not valid, expecting 'DD-MM-YYYY'`
    }

  const dtNascimentoBiggerThanToday = userDtNascimento.isAfter(moment())
  if (dtNascimentoBiggerThanToday)
    return {
      isValid: false,
      errorMsg: 'dtNascimento bigger than today'
    }

  if (calculateAge(userDtNascimento) < 18)
    return {
      isValid: false,
      errorMsg: 'Contato must be over 18 years'
    }

  return { isValid: true }
}

const isSexoValid = (sexo: string) => {
  const sexValues = ['M', 'F']

  return sexValues.includes(sexo)
}

export default {
  findAll: async () => {
    return new ApiResponse(true, await userRepository.findAll())
  },

  findOne: async (userId: string) => {
    const dbUser: FindOneUserDTO | null = await userRepository.findOneByUserId(
      userId
    )

    if (dbUser) dbUser.idade = calculateAge(moment(dbUser.dtNascimento))

    return new ApiResponse(true, dbUser)
  },

  create: async (newUser: CreateUserDTO) => {
    const { isValid, errorMsg } = validateDtNascimento(newUser.dtNascimento)
    if (!isValid) return errorMsg

    if (!isSexoValid(newUser.sexo)) return 'Sexo not valid, expecting M or F'

    // Creates user
    let dbNewUser = new User()
    dbNewUser.name = newUser.name
    dbNewUser.dtNascimento = moment
      .utc(newUser.dtNascimento, 'DD-MM-YYYY')
      .toDate()
    dbNewUser.sexo = newUser.sexo
    dbNewUser = await userRepository.save(dbNewUser)

    return new ApiResponse(true, dbNewUser)
  },

  update: async (userId: string, user: CreateUserDTO) => {
    const dbUser = await userRepository.findOneByUserId(userId)
    if (!dbUser) return 'User not found'

    const { isValid, errorMsg } = validateDtNascimento(user.dtNascimento)
    if (!isValid) return errorMsg

    if (!isSexoValid(user.sexo)) return 'Sexo not valid, expecting M or F'

    dbUser.name = user.name
    dbUser.dtNascimento = moment.utc(user.dtNascimento, 'DD-MM-YYYY').toDate()
    dbUser.sexo = user.sexo

    await userRepository.update(dbUser)

    return new ApiResponse(true)
  },

  delete: async (userId: string, isSoftDelete?: string) => {
    isSoftDelete
      ? await userRepository.softDelete(userId)
      : await userRepository.delete(userId)

    return new ApiResponse(true)
  }
}
