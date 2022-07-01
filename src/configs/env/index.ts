import dotenv from 'dotenv'

dotenv.config()

enum EXPECTED_ENV_VARIABLES {
  PORT = 'PORT',
  DB_TYPE = 'DB_TYPE',
  DB_HOST = 'DB_HOST',
  DB_PORT = 'DB_PORT',
  DB_USER = 'DB_USER',
  DB_PASSWORD = 'DB_PASSWORD',
  DB_NAME = 'DB_NAME',
  DB_SYNCRONIZE = 'DB_SYNCRONIZE'
}

export type IENV = {
  [key in EXPECTED_ENV_VARIABLES]: string
}

let ENV: IENV = {
  PORT: '',
  DB_TYPE: '',
  DB_HOST: '',
  DB_PORT: '',
  DB_USER: '',
  DB_PASSWORD: '',
  DB_NAME: '',
  DB_SYNCRONIZE: ''
}

const loadEnvVariables = () => {
  let missingVariables: string[] = []

  Object.keys(EXPECTED_ENV_VARIABLES).forEach(key => {
    let envVariable = process.env[key]

    envVariable
      ? (ENV[key as keyof typeof EXPECTED_ENV_VARIABLES] = envVariable)
      : missingVariables.push(key)
  })

  if (missingVariables.length > 0)
    throw new Error(
      `Missing environment variables: ${missingVariables.join(', ')}`
    )
}

export { ENV, loadEnvVariables }
