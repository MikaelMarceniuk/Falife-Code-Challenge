import supertest from 'supertest'
import app from '../server'
import configs from '../configs'
import bcrypt from 'bcrypt'

interface IUser {
  id: string
  name: string
  email: string
  password: string
  createdAt: string
  updatedAt: string
  deletedAt: null | string
}

let newUser = {
  name: 'Mikael Marceniuk',
  email: 'mika.marceniuk@gmail.com',
  password: '12345678'
}

let createdUser: IUser

beforeAll(async () => {
  await configs.dbDataSource.initialize()
})

describe('Testing User CRUD', () => {
  it('Should return no users', async () => {
    let { body, status } = await supertest(app).get('/api/v1/user')

    expect(status).toEqual(200)
    expect(body).toStrictEqual([])
  })

  it('Should create a new user', async () => {
    let { body, status } = await supertest(app)
      .post('/api/v1/user')
      .send(newUser)

    expect(status).toEqual(200)
    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('email')
    expect(body).toHaveProperty('name')
    expect(body).toHaveProperty('password')

    createdUser = body
  })

  it('Should return the existing user', async () => {
    let { body, status } = await supertest(app).get('/api/v1/user')

    expect(status).toEqual(200)
    expect(body).toHaveLength(1)
    expect(body[0].id).toStrictEqual(createdUser.id)
    expect(body[0].name).toStrictEqual(createdUser.name)
    expect(body[0].email).toStrictEqual(createdUser.email)
    expect(body[0].password).toStrictEqual(createdUser.password)
  })

  it('Should update user', async () => {
    const newEmail = 'mikael_marceniuk@gmail.com'

    await supertest(app)
      .patch(`/api/v1/user/${createdUser.id}`)
      .send({ ...newUser, email: newEmail })

    const { body, status } = await supertest(app).get(
      `/api/v1/user/${createdUser.id}`
    )

    expect(status).toEqual(200)
    expect(body.email).toBe(newEmail)

    createdUser = { ...createdUser, email: newEmail }
    newUser = { ...newUser, email: newEmail }
  })

  it('Should return email already registered', async () => {
    let { body, status } = await supertest(app)
      .post('/api/v1/user')
      .send(newUser)

    expect(status).toEqual(200)
    expect(body).toBe('Email already registered')
  })

  it('Should soft delete user', async () => {
    await supertest(app).delete(`/api/v1/user/${createdUser.id}`)

    const { body, status } = await supertest(app).get(
      `/api/v1/user/${createdUser.id}`
    )

    expect(status).toEqual(200)
    expect(body).toBe(null)
  })

  it('Should return Account is deleted', async () => {
    let { body, status } = await supertest(app)
      .post('/api/v1/user')
      .send(newUser)

    expect(status).toEqual(200)
    expect(body).toBe('Account is deleted')
  })
})
