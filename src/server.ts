import express from 'express'
import configs from './configs'
import morgan from 'morgan'

class App {
  app

  constructor() {
    this.app = express()
    this.runConfigs()
    this.runMiddlewares()
    this.runRoutes()
  }

  runConfigs() {
    configs.loadEnvVariables()
  }

  runMiddlewares() {
    this.app.use(configs.cors)
    this.app.use(morgan('dev'))
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
  }

  runRoutes() {
    this.app.get('/', (req, res) => res.send('Hello World!'))
  }
}

export default new App().app
