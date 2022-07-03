import { DataSource } from 'typeorm'
import ENV from '../env'

const NODE_ENV = process.env.NODE_ENV

const dbDataSource =
  NODE_ENV == 'test'
    ? new DataSource({
        type: 'sqlite',
        database: ':memory:',
        synchronize: true,
        entities: [ENV.DB_ENTITIES]
      })
    : new DataSource({
        type: ENV.DB_TYPE as any,
        host: ENV.DB_HOST,
        port: parseInt(ENV.DB_PORT),
        username: ENV.DB_USER,
        password: ENV.DB_PASSWORD,
        database: ENV.DB_NAME,
        synchronize: ENV.DB_SYNCRONIZE === 'true',
        entities: [ENV.DB_ENTITIES]
      })

if (NODE_ENV != 'test') {
  dbDataSource
    .initialize()
    .then(() => {
      console.log('Successfully initialized dbSource!')
    })
    .catch(err => {
      console.error('Error during dbSource initialization', err)
    })
}

export default dbDataSource
