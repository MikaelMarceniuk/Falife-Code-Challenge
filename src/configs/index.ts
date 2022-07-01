import { ENV, loadEnvVariables } from './env'
import cors from './cors'

loadEnvVariables()

import dbDataSource from './dbSource'

export default { ENV, cors, dbDataSource }
