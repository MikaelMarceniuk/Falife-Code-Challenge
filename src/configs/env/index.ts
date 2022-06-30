import dotenv from 'dotenv'

dotenv.config()

enum EXPECTED_ENV_VARIABLES {
  PORT = 'PORT'
}

export type IENV = {
  [key in EXPECTED_ENV_VARIABLES]: string
}

let ENV: IENV = {
  PORT: ''
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
