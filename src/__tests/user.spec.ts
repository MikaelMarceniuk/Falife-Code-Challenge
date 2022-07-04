import supertest from 'supertest'
import app from '../server'
import configs from '../configs'
import CreateUserDTO from '../resources/user/dto/create-user.dto'
import moment from 'moment'

interface IUser {
  name: string
  dtNascimento: string
  sexo: string
  deletedAt: null
  id: string
  createdAt: string
  updatedAt: string
  idade?: number
}

let newUser: CreateUserDTO = {
  name: 'Mikael Marceniuk',
  dtNascimento: '28-06-2002',
  sexo: 'M'
}

let createdUser: IUser

beforeAll(async () => {
  await configs.dbDataSource.initialize()
})

describe('Testing User CRUD', () => {
  it('Should return no users', async () => {
    let { body, status } = await supertest(app).get('/api/v1/user')

    expect(status).toEqual(200)
    expect(body.isSuccess).toBe(true)
    expect(body.data).toStrictEqual([])
  })

  it('Should return dtNascimento invalid', async () => {
    let { body } = await supertest(app)
      .post('/api/v1/user')
      .send({ ...newUser, dtNascimento: 'A' })

    expect(body.isSuccess).toBe(false)
    expect(body.data).toBe("dtNascimento not valid, expecting 'DD-MM-YYYY'")
  })

  it('Should return dtNascimento bigger than today', async () => {
    let { body } = await supertest(app)
      .post('/api/v1/user')
      .send({ ...newUser, dtNascimento: '01-01-2070' })

    expect(body.isSuccess).toBe(false)
    expect(body.data).toBe('dtNascimento bigger than today')
  })

  it('Should return Contato must be over 18 years', async () => {
    let { body } = await supertest(app)
      .post('/api/v1/user')
      .send({ ...newUser, dtNascimento: '01-01-2005' })

    expect(body.isSuccess).toBe(false)
    expect(body.data).toBe('Contato must be over 18 years')
  })

  it('Should return Sexo not valid, expecting M or F', async () => {
    let { body } = await supertest(app)
      .post('/api/v1/user')
      .send({ ...newUser, sexo: 'Masculino' })

    expect(body.isSuccess).toBe(false)
    expect(body.data).toBe('Sexo not valid, expecting M or F')
  })

  it('Should create a new user', async () => {
    let { body, status } = await supertest(app)
      .post('/api/v1/user')
      .send(newUser)

    expect(status).toEqual(200)
    expect(body.isSuccess).toBe(true)
    expect(body.data).toHaveProperty('id')
    expect(body.data).toHaveProperty('name')
    expect(body.data).toHaveProperty('dtNascimento')
    expect(body.data).toHaveProperty('sexo')

    createdUser = body.data
  })

  it('Should return the existing user', async () => {
    let { body, status } = await supertest(app).get('/api/v1/user')

    expect(status).toEqual(200)
    expect(body.data).toHaveLength(1)
    expect(body.data[0].id).toStrictEqual(createdUser.id)
    expect(body.data[0].name).toStrictEqual(createdUser.name)
    expect(body.data[0].dtNascimento).toStrictEqual(createdUser.dtNascimento)
    expect(body.data[0].sexo).toStrictEqual(createdUser.sexo)
  })

  it('Should return the existing user with details', async () => {
    let { body, status } = await supertest(app).get(
      `/api/v1/user/${createdUser.id}`
    )

    expect(status).toEqual(200)
    expect(body.data.id).toStrictEqual(createdUser.id)
    expect(body.data.name).toStrictEqual(createdUser.name)
    expect(body.data.dtNascimento).toStrictEqual(createdUser.dtNascimento)
    expect(body.data.sexo).toStrictEqual(createdUser.sexo)
    expect(body.data).toHaveProperty('idade')
  })

  it('Should update user', async () => {
    const newDtNascimento = '27-06-2000'

    await supertest(app)
      .patch(`/api/v1/user/${createdUser.id}`)
      .send({ ...newUser, dtNascimento: newDtNascimento })

    const { body, status } = await supertest(app).get(
      `/api/v1/user/${createdUser.id}`
    )

    expect(status).toEqual(200)
    expect(moment(body.data.dtNascimento).format('DD-MM-YYYY')).toBe(
      newDtNascimento
    )

    createdUser = { ...createdUser, dtNascimento: newDtNascimento }
    newUser = { ...newUser, dtNascimento: newDtNascimento }
  })

  it('Should soft delete user', async () => {
    await supertest(app).delete(`/api/v1/user/${createdUser.id}?soft=true`)

    const { body, status } = await supertest(app).get(
      `/api/v1/user/${createdUser.id}`
    )

    expect(status).toEqual(200)
    expect(body.data).toBe(null)
  })
})
