import { DataSource, Db } from 'typeorm'
import { ENV } from '../env'

const dbDataSource = new DataSource({
  type: ENV.DB_TYPE as any,
  host: ENV.DB_HOST,
  port: parseInt(ENV.DB_PORT),
  username: ENV.DB_USER,
  password: ENV.DB_PASSWORD,
  database: ENV.DB_NAME,
  synchronize: ENV.DB_SYNCRONIZE === 'true'
})

dbDataSource
  .initialize()
  .then(() => {
    console.log('Successfully initialized dbSource!')
  })
  .catch(err => {
    console.error('Error during dbSource initialization', err)
  })

export default dbDataSource
